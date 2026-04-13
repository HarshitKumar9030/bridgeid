import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Identity from "@/models/Identity";
import { requireServerSession } from "@/lib/server-auth";

function computeTrustScore(ngoVerified: boolean, communityConfirmations: number, interactionsCount: number) {
  const ngo = ngoVerified ? 50 : 0;
  const community = Math.min(communityConfirmations, 3) * 10;
  const interactions = Math.min(interactionsCount, 20);
  return Math.min(100, ngo + community + interactions);
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "You must be logged in to verify an identity." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Identity id is required" }, { status: 400 });
  }

  await connectToDatabase();

  let existing;
  try {
    existing = await Identity.findById(id);
  } catch {
    return NextResponse.json({ message: "Invalid identity id" }, { status: 400 });
  }

  if (!existing) {
    return NextResponse.json({ message: "Identity not found" }, { status: 404 });
  }

  // Increment community confirmations
  existing.communityConfirmations = (existing.communityConfirmations || 0) + 1;
  // Re-calculate score
  existing.trustScore = computeTrustScore(
    existing.ngoVerified,
    existing.communityConfirmations,
    existing.interactionsCount || 0
  );

  await existing.save();

  return NextResponse.json({ 
    message: "Identity endorsed successfully", 
    trustScore: existing.trustScore, 
    confirmations: existing.communityConfirmations 
  });
}
