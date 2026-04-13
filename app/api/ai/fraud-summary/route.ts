import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Identity from "@/models/Identity";
import { requireServerSession } from "@/lib/server-auth";
import { summarizeFraudSignals } from "@/lib/gemini";

export async function GET() {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const userId = (session.user as { id?: string }).id ?? "";
  const identities = await Identity.find({ createdByUserId: userId }).sort({ createdAt: -1 }).limit(100).lean();

  const suspicious = identities.filter((item) => {
    const scoreSpike = item.trustScore > 85 && !item.ngoVerified;
    const noSignals = item.communityConfirmations === 0 && item.interactionsCount === 0 && item.trustScore > 0;
    return scoreSpike || noSignals;
  });

  const signals = suspicious.slice(0, 8).map((item) => {
    return `${item.alias}: trust=${item.trustScore}, ngo=${item.ngoVerified}, community=${item.communityConfirmations}, interactions=${item.interactionsCount}`;
  });

  if (signals.length === 0) {
    return NextResponse.json({
      suspiciousCount: 0,
      summary: "No major fraud signals detected in current identity records.",
    });
  }

  let summary = `${signals.length} records need review.`;

  if (process.env.GEMINI_API_KEY) {
    try {
      summary = await summarizeFraudSignals(signals);
    } catch {
      // Keep fallback summary when model call fails.
    }
  }

  return NextResponse.json({
    suspiciousCount: signals.length,
    summary,
    signals,
  });
}
