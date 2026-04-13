import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Identity, { type NeedCategory, type UrgencyLevel } from "@/models/Identity";
import { requireServerSession } from "@/lib/server-auth";
import { classifyNeedWithGemini } from "@/lib/gemini";

function computeTrustScore(ngoVerified: boolean, communityConfirmations: number, interactionsCount: number) {
  const ngo = ngoVerified ? 50 : 0;
  const community = Math.min(communityConfirmations, 3) * 10;
  const interactions = Math.min(interactionsCount, 20);
  return Math.min(100, ngo + community + interactions);
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Identity id is required" }, { status: 400 });
  }

  const body = await request.json();
  const {
    alias,
    ageRange,
    skills,
    needs,
    needDescription,
    location,
    photoUrl,
    ngoVerified,
    communityConfirmations,
    interactionsCount,
  } = body;

  if (!alias || !ageRange) {
    return NextResponse.json({ message: "Alias and age range are required" }, { status: 400 });
  }

  await connectToDatabase();

  const createdByUserId = (session.user as { id?: string }).id ?? "";
  let existing;
  try {
    existing = await Identity.findOne({ _id: id, createdByUserId });
  } catch {
    return NextResponse.json({ message: "Invalid identity id" }, { status: 400 });
  }

  if (!existing) {
    return NextResponse.json({ message: "Identity not found" }, { status: 404 });
  }

  let aiCategory: NeedCategory = "Other";
  let aiUrgency: UrgencyLevel = "Low";

  if (typeof needDescription === "string" && needDescription.trim().length > 0 && process.env.GEMINI_API_KEY) {
    try {
      const classified = await classifyNeedWithGemini(needDescription);
      aiCategory = classified.category;
      aiUrgency = classified.urgency;
    } catch {
      // Keep fallback values when classification fails.
    }
  }

  const resolvedNeeds = Array.isArray(needs) && needs.length > 0 ? needs : [aiCategory];
  const trustScore = computeTrustScore(
    Boolean(ngoVerified),
    Number(communityConfirmations ?? 0),
    Number(interactionsCount ?? 0)
  );

  existing.alias = alias;
  existing.ageRange = ageRange;
  existing.skills = Array.isArray(skills) ? skills : [];
  existing.needs = resolvedNeeds;
  existing.needDescription = typeof needDescription === "string" ? needDescription : "";
  existing.urgency = aiUrgency;
  existing.location = location || "Unspecified";
  existing.photoUrl = typeof photoUrl === "string" ? photoUrl : existing.photoUrl;
  existing.ngoVerified = Boolean(ngoVerified);
  existing.communityConfirmations = Number(communityConfirmations ?? 0);
  existing.interactionsCount = Number(interactionsCount ?? 0);
  existing.trustScore = trustScore;

  await existing.save();

  return NextResponse.json({ identity: existing.toObject() });
}
