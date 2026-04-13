import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Identity from "@/models/Identity";
import { requireServerSession } from "@/lib/server-auth";

export async function GET() {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const userId = (session.user as { id?: string }).id ?? "";

  const [total, highTrust, avgTrust, highUrgency] = await Promise.all([
    Identity.countDocuments({ createdByUserId: userId }),
    Identity.countDocuments({ createdByUserId: userId, trustScore: { $gte: 70 } }),
    Identity.aggregate([
      { $match: { createdByUserId: userId } },
      { $group: { _id: null, avgTrust: { $avg: "$trustScore" } } },
    ]),
    Identity.countDocuments({ createdByUserId: userId, urgency: "High" }),
  ]);

  return NextResponse.json({
    total,
    highTrust,
    avgTrust: avgTrust[0]?.avgTrust ? Number(avgTrust[0].avgTrust.toFixed(1)) : 0,
    highUrgency,
  });
}
