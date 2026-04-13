import { NextResponse } from "next/server";
import { requireServerSession } from "@/lib/server-auth";
import { classifyNeedWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  const session = await requireServerSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ message: "GEMINI_API_KEY is not configured" }, { status: 503 });
  }

  const body = await request.json();
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ message: "Text is required" }, { status: 400 });
  }

  const result = await classifyNeedWithGemini(text);
  return NextResponse.json(result);
}
