import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { NORMAL_PROMPT, ROAST_PROMPT } from "./prompts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set");
const genAI = new GoogleGenerativeAI(apiKey);

const geminiResponseSchema = z.object({
  verdict: z.string(),
  roastTitle: z.string(),
  score: z.number().min(0).max(10),
  lineCount: z.number().int().positive(),
  issues: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      severity: z.enum(["critical", "warning", "good"]),
      lineNumber: z.number().int().nullable(),
    }),
  ),
  suggestions: z.array(
    z.object({
      filename: z.string(),
      diff: z.string(),
    }),
  ),
});

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
  const parsed = geminiResponseSchema.parse(JSON.parse(text));

  return parsed;
}
