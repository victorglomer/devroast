import { type NextRequest, NextResponse } from "next/server";
import { createRoast, createSubmission, getUserByUsername } from "@/db/queries";

const MOCK_USERNAME = "victorvhvhvh";

function generateMockRoast(
  code: string,
  language: string,
  roastMode: "normal" | "roast",
) {
  const lineCount = code.split("\n").length;
  const hasVar = code.includes("var ");
  const hasConsoleLog = code.includes("console.log");
  const hasEval = code.includes("eval(");

  const issues = [];

  if (hasVar) {
    issues.push({
      title: "Using var instead of const/let",
      description:
        "The var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs.",
      severity: "critical",
      line_number: code.split("\n").findIndex((l) => l.includes("var ")) + 1,
    });
  }

  if (hasConsoleLog) {
    issues.push({
      title: "Console.log in production code",
      description:
        "Remove console.log statements before deploying to production.",
      severity: "warning",
      line_number:
        code.split("\n").findIndex((l) => l.includes("console.log")) + 1,
    });
  }

  if (hasEval) {
    issues.push({
      title: "Using eval() - dangerous!",
      description:
        "eval() is evil. It executes arbitrary code and is a major security risk.",
      severity: "critical",
      line_number: code.split("\n").findIndex((l) => l.includes("eval(")) + 1,
    });
  }

  if (issues.length === 0) {
    issues.push({
      title: "No obvious issues found",
      description:
        "Your code looks surprisingly decent. But we can still find something...",
      severity: "good",
      line_number: null,
    });
  }

  const verdicts = [
    "needs_serious_help",
    "barely_survivable",
    "code_is_cringe",
    "please_seek_help",
    "painful_to_read",
  ];

  const roastTitles = [
    "this code looks like it was written during a power outage... in 2005.",
    "i've seen better code in a hello world tutorial.",
    "your code is so bad it made my compiler cry.",
    "please, for the love of all that is holy, use a linter.",
    "this is why we can't have nice things in production.",
  ];

  const normalTitles = [
    "could use some improvements",
    "needs refactoring",
    "works but could be better",
    "acceptable with caveats",
    "functional but not ideal",
  ];

  const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
  const roastTitle =
    roastMode === "roast"
      ? roastTitles[Math.floor(Math.random() * roastTitles.length)]
      : normalTitles[Math.floor(Math.random() * normalTitles.length)];

  const score = Math.random() * 10;

  return {
    verdict,
    roastTitle,
    score: score.toFixed(1),
    lineCount,
    issues,
    suggestions: [
      {
        filename: `code.${language === "javascript" ? "js" : language}`,
        diff: "// Consider using modern JavaScript features...\n// Replace var with const/let",
      },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, roastMode = "roast" } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Missing required fields: code, language" },
        { status: 400 },
      );
    }

    const user = await getUserByUsername(MOCK_USERNAME);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const submissionId = await createSubmission({
      userId: user.id,
      code,
      language,
      roastMode,
    });

    const roast = generateMockRoast(code, language, roastMode);

    await createRoast({
      submissionId,
      verdict: roast.verdict,
      roastTitle: roast.roastTitle,
      score: roast.score,
      lineCount: roast.lineCount,
      issues: roast.issues,
      suggestions: roast.suggestions,
    });

    return NextResponse.json({
      submissionId,
      ...roast,
    });
  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
