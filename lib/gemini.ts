import { GoogleGenAI } from "@google/genai";

type ClassificationResult = {
  category: "Food" | "Job" | "Healthcare" | "Shelter" | "Other";
  urgency: "Low" | "Medium" | "High";
  reason: string;
};

let aiClient: GoogleGenAI | null = null;

function getClient() {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  aiClient = new GoogleGenAI({ apiKey, apiVersion: "v1alpha" });
  return aiClient;
}

function parseJsonFromText(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Model did not return JSON");
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function classifyNeedWithGemini(input: string): Promise<ClassificationResult> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "Classify this need description for an undocumented worker identity record.",
              "Return JSON ONLY with keys: category, urgency, reason.",
              "Allowed category values: Food, Job, Healthcare, Shelter, Other.",
              "Allowed urgency values: Low, Medium, High.",
              `Description: ${input}`,
            ].join("\n"),
          },
        ],
      },
    ],
  });

  const rawText = response.text ?? "";
  const parsed = parseJsonFromText(rawText) as ClassificationResult;

  return {
    category: ["Food", "Job", "Healthcare", "Shelter", "Other"].includes(parsed.category)
      ? parsed.category
      : "Other",
    urgency: ["Low", "Medium", "High"].includes(parsed.urgency) ? parsed.urgency : "Low",
    reason: typeof parsed.reason === "string" ? parsed.reason : "Classified by model",
  };
}

export async function summarizeFraudSignals(signals: string[]): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: [
              "You are analyzing trust-network anomalies.",
              "Given the following signals, return a concise 3-4 sentence risk summary for dashboard operators.",
              "Signals:",
              ...signals.map((s) => `- ${s}`),
            ].join("\n"),
          },
        ],
      },
    ],
  });

  return response.text ?? "No AI summary available.";
}
