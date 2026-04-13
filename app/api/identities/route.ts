import { NextResponse } from "next/server";
import QRCode from "qrcode";
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

export async function GET() {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const identities = await Identity.find({ createdByUserId: (session.user as { id?: string }).id ?? "" })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({ identities });
}

export async function POST(request: Request) {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
    photoKey,
    ngoVerified,
    communityConfirmations,
    interactionsCount,
  } = body;

  if (!alias || !ageRange) {
    return NextResponse.json({ message: "Alias and age range are required" }, { status: 400 });
  }

  await connectToDatabase();

  const identityId = crypto.randomUUID();
  const qrCodeDataUrl = await QRCode.toDataURL(identityId, {
    margin: 1,
    width: 320,
    color: {
      dark: "#F4F4F8",
      light: "#111116",
    },
  });

  let aiCategory: NeedCategory = "Other";
  let aiUrgency: UrgencyLevel = "Low";

  if (typeof needDescription === "string" && needDescription.trim().length > 0 && process.env.GEMINI_API_KEY) {
    try {
      const classified = await classifyNeedWithGemini(needDescription);
      aiCategory = classified.category;
      aiUrgency = classified.urgency;
    } catch {
      // Keep fallback category/urgency when model call fails.
    }
  }

  const resolvedNeeds = Array.isArray(needs) && needs.length > 0 ? needs : [aiCategory];
  const resolvedUrgency = aiUrgency;

  const trustScore = computeTrustScore(
    Boolean(ngoVerified),
    Number(communityConfirmations ?? 0),
    Number(interactionsCount ?? 0)
  );

  const identity = await Identity.create({
    identityId,
    alias,
    ageRange,
    skills: Array.isArray(skills) ? skills : [],
    needs: resolvedNeeds,
    needDescription: typeof needDescription === "string" ? needDescription : "",
    urgency: resolvedUrgency,
    location: location || "Unspecified",
    photoUrl,
    photoKey,
    ngoVerified: Boolean(ngoVerified),
    communityConfirmations: Number(communityConfirmations ?? 0),
    interactionsCount: Number(interactionsCount ?? 0),
    trustScore,
    qrCodeDataUrl,
    createdByUserId: (session.user as { id?: string }).id ?? "",
  });

  return NextResponse.json({ identity }, { status: 201 });
}
