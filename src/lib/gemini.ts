import { GoogleGenerativeAI } from "@google/generative-ai";
import { NORMAL_PROMPT, ROAST_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export interface GeminiIssue {
  title: string;
  description: string;
  severity: "critical" | "warning" | "good";
  lineNumber: number | null;
}

export interface GeminiSuggestion {
  filename: string;
  diff: string;
}

export interface GeminiRoastResponse {
  verdict: string;
  roastTitle: string;
  score: number;
  lineCount: number;
  issues: GeminiIssue[];
  suggestions: GeminiSuggestion[];
}

export async function analyzeCode(
  code: string,
  roastMode: "normal" | "roast",
): Promise<GeminiRoastResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = roastMode === "roast" ? ROAST_PROMPT : NORMAL_PROMPT;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${prompt}\n\n\`\`\`\n${code}\n\`\`\`` }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = result.response.text();
  const parsed = JSON.parse(text) as GeminiRoastResponse;

  return {
    ...parsed,
    score: Number(parsed.score),
    lineCount: Number(parsed.lineCount),
  };
}
