# Submit Roast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock code analysis with real Google Gemini AI integration, allowing users to paste code and receive AI-generated roasts with issues, score, verdict, and suggestions.

**Architecture:** tRPC mutation on the server calls Gemini 2.5 Flash API with structured output (JSON mode). The result is saved to the DB and the user is redirected to the results page which now fetches real data instead of mock data.

**Tech Stack:** Next.js 16, tRPC v11, Drizzle ORM, Google Gemini API (`@google/generative-ai`), Zod v4

---

### Task 1: Install dependency and verify env

**Files:**
- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1: Install `@google/generative-ai`**

Run: `pnpm add @google/generative-ai`

- [ ] **Step 2: Verify `.env.local` has the API key**

Run: `cat .env.local | grep GEMINI_API_KEY`
Expected: `GEMINI_API_KEY=AIzaSy...`

---

### Task 2: Create prompts template

**Files:**
- Create: `src/lib/prompts.ts`

- [ ] **Step 1: Write the prompts file**

```typescript
export const NORMAL_PROMPT = `You are an expert code reviewer. Analyze the following code and provide a structured review.

Return a JSON object with this exact structure:
{
  "verdict": "one of: needs_serious_help, barely_survivable, code_is_cringe, please_seek_help, painful_to_read",
  "roastTitle": "a short, constructive one-line summary of the code quality",
  "score": "a number from 0 to 10, where 0 is terrible and 10 is perfect",
  "lineCount": "number of lines in the code",
  "issues": [
    {
      "title": "short issue title",
      "description": "detailed explanation of the issue",
      "severity": "critical | warning | good",
      "lineNumber": "line number or null if not applicable"
    }
  ],
  "suggestions": [
    {
      "filename": "suggested filename",
      "diff": "suggested code fix as a unified diff string"
    }
  ]
}

Be thorough but fair. Point out bugs, anti-patterns, security issues, and style problems. Also mention what the code does well.`;

export const ROAST_PROMPT = `You are a brutally honest code reviewer with a sarcastic sense of humor. Your job is to roast the following code mercilessly while still being technically accurate.

Return a JSON object with this exact structure:
{
  "verdict": "one of: needs_serious_help, barely_survivable, code_is_cringe, please_seek_help, painful_to_read",
  "roastTitle": "a funny, sarcastic one-line roast title (be creative and mean)",
  "score": "a number from 0 to 10, where 0 is terrible and 10 is perfect (be harsh)",
  "lineCount": "number of lines in the code",
  "issues": [
    {
      "title": "short issue title (make it funny/sarcastic)",
      "description": "detailed explanation roasting the issue while explaining the problem",
      "severity": "critical | warning | good",
      "lineNumber": "line number or null if not applicable"
    }
  ],
  "suggestions": [
    {
      "filename": "suggested filename",
      "diff": "suggested code fix as a unified diff string"
    }
  ]
}

Be funny, be mean, but be accurate. If the code is actually good, admit it grudgingly. Use sarcasm, exaggeration, and developer humor.`;
```

---

### Task 3: Create Gemini service

**Files:**
- Create: `src/lib/gemini.ts`

- [ ] **Step 1: Write the Gemini service**

```typescript
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
    contents: [{ role: "user", parts: [{ text: `${prompt}\n\n\`\`\`\n${code}\n\`\`\`` }] }],
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
```

---

### Task 4: Create tRPC roast router

**Files:**
- Create: `src/trpc/routers/roast.ts`

- [ ] **Step 1: Write the roast router**

```typescript
import { z } from "zod";
import { publicProcedure, router } from "../init";
import { users } from "@/db/schema";
import { analyzeCode } from "@/lib/gemini";
import { createRoast, createSubmission, getUserByUsername } from "@/db/queries";
import { eq } from "drizzle-orm";

const MOCK_USERNAME = "victorvhvhvh";

const programmingLanguages = [
  "javascript", "typescript", "python", "rust", "go", "java",
  "c", "cpp", "ruby", "php", "swift", "kotlin", "csharp", "sql",
] as const;

export const roastRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Code is required"),
        language: z.enum(programmingLanguages).default("javascript"),
        roastMode: z.enum(["normal", "roast"]).default("roast"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let user = await getUserByUsername(MOCK_USERNAME);

      if (!user) {
        const [newUser] = await ctx.db
          .insert(users)
          .values({ username: MOCK_USERNAME })
          .returning();

        if (!newUser) {
          throw new Error("Failed to create user");
        }

        user = { id: newUser.id, username: newUser.username, createdAt: newUser.createdAt };
      }

      const submissionId = await createSubmission({
        userId: user.id,
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
      });

      if (!submissionId) {
        throw new Error("Failed to create submission");
      }

      const analysis = await analyzeCode(input.code, input.roastMode);

      await createRoast({
        submissionId,
        verdict: analysis.verdict,
        roastTitle: analysis.roastTitle,
        score: analysis.score.toFixed(1),
        lineCount: analysis.lineCount,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      });

      return {
        submissionId,
        score: analysis.score,
        verdict: analysis.verdict,
        roastTitle: analysis.roastTitle,
        lineCount: analysis.lineCount,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      };
    }),
});
```

- [ ] **Step 2: Check TypesScript compiles**

Run: `pnpm typecheck` or `npx tsc --noEmit`
Expected: No type errors

---

### Task 5: Register roast router in app router

**Files:**
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Step 1: Register `roastRouter`**

Replace the existing content:

```typescript
import { router } from "../init";
import { leaderboardRouter } from "./leaderboard";
import { metricsRouter } from "./metrics";
import { roastRouter } from "./roast";

export const appRouter = router({
  metrics: metricsRouter,
  leaderboard: leaderboardRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
```

---

### Task 6: Update HeroSection to use tRPC mutation

**Files:**
- Modify: `src/components/hero-section.tsx`

- [ ] **Step 1: Replace `fetch` with tRPC mutation**

Change the component to use `trpc.roast.submit.useMutation()`:

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/trpc/client";

export function HeroSection() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const mutation = trpc.roast.submit.useMutation();

  const handleSubmit = () => {
    if (!code.trim()) return;

    mutation.mutate(
      {
        code,
        language: "javascript",
        roastMode: roastMode ? "roast" : "normal",
      },
      {
        onSuccess: (data) => {
          router.push(`/results/${data.submissionId}`);
        },
      },
    );
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-2xl font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> drop your code below
          and we&apos;ll rate it — brutally honest or full roast mode
        </h1>
      </div>

      <div className="w-[780px] flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
        <div className="flex items-center justify-between h-10 px-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
          </div>
        </div>

        <textarea
          className="w-full h-[360px] p-4 bg-[#111111] text-[#FAFAFA] font-mono text-sm resize-none focus:outline-none placeholder:text-[#4B5563]"
          placeholder={"// paste your code here..."}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="w-[780px] flex items-center justify-between">
        <Toggle
          checked={roastMode}
          onChange={setRoastMode}
          label="roast mode"
        />
        <Button disabled={!code.trim() || mutation.isPending} onClick={handleSubmit}>
          {mutation.isPending ? "Roasting..." : "Roast My Code"}
        </Button>
      </div>
    </section>
  );
}
```

---

### Task 7: Update ResultsPage to fetch real data

**Files:**
- Modify: `src/app/results/[id]/page.tsx`

- [ ] **Step 1: Rewrite the results page to use real data**

Replace the entire file. Remove `MOCK_RESULT`. Use `getSubmissionWithRoast` from queries. Accept `params` prop:

```typescript
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { getSubmissionWithRoast } from "@/db/queries";

export const metadata = {
  title: "Roast Results - Devroast",
  description: "Your code has been roasted",
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSubmissionWithRoast(id);

  if (!result) {
    notFound();
  }

  const score = Number(result.score);
  const issues = result.issues as Array<{
    title: string;
    description: string;
    severity: "critical" | "warning" | "good";
    lineNumber: number | null;
  }>;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-5xl mx-auto">
        {/* Nav */}
        <nav className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-[#10B981]">
              &gt;
            </span>
            <span className="text-lg font-medium font-mono text-[#FAFAFA]">
              devroast
            </span>
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-mono text-[#6B7280] hover:text-[#FAFAFA]"
          >
            leaderboard
          </Link>
        </nav>

        {/* Score Hero */}
        <section className="flex items-center justify-center gap-12">
          <ScoreRing score={score} size={180} />
          <div className="flex flex-col gap-4 max-w-md">
            <Badge
              variant={
                score < 4
                  ? "critical"
                  : score < 7
                    ? "warning"
                    : "good"
              }
            >
              verdict: {result.verdict}
            </Badge>
            <p className="text-xl font-mono text-[#FAFAFA] leading-relaxed">
              &quot;{result.roastTitle}&quot;
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#4B5563]">
              <span>lang: {result.language}</span>
              <span>·</span>
              <span>{result.lineCount} lines</span>
            </div>
          </div>
        </section>

        {/* Code Preview */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#10B981]">
              {'//'}
            </span>
            <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
              your_submission
            </h2>
          </div>
          <CodeBlock
            code={result.code}
            language={result.language}
          />
        </section>

        {/* Detailed Analysis */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#10B981]">
              {'//'}
            </span>
            <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
              detailed_analysis
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {issues.map((issue) => (
              <div
                key={issue.title}
                className="flex flex-col gap-3 p-5 rounded-md border border-[#2A2A2A] bg-[#0F0F0F]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      issue.severity === "critical"
                        ? "bg-[#EF4444]"
                        : issue.severity === "warning"
                          ? "bg-[#F59E0B]"
                          : "bg-[#10B981]"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono font-medium ${
                      issue.severity === "critical"
                        ? "text-[#EF4444]"
                        : issue.severity === "warning"
                          ? "text-[#F59E0B]"
                          : "text-[#10B981]"
                    }`}
                  >
                    {issue.severity}
                  </span>
                  {issue.lineNumber && (
                    <span className="text-xs font-mono text-[#4B5563]">
                      line {issue.lineNumber}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-mono font-medium text-[#FAFAFA]">
                  {issue.title}
                </h3>
                <p className="text-xs font-mono text-[#6B7280] leading-relaxed">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Fix */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#10B981]">
              {'//'}
            </span>
            <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
              suggested_fix
            </h2>
          </div>
          <div className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden bg-[#111111]">
            <div className="flex items-center h-10 px-4 border-b border-[#2A2A2A]">
              <span className="text-xs font-mono text-[#6B7280]">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="p-4">
              <CodeBlock
                code={result.suggestions?.[0]?.diff ?? "No suggestions"}
                language="diff"
                showHeader={false}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

### Task 8: Build and verify

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: Successful build

- [ ] **Step 3: Start dev server and test**

Run: `pnpm dev`
Expected: Dev server starts, go to http://localhost:3000, paste code, click "Roast My Code", verify it calls Gemini and redirects to results page with real data.
