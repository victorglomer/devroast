import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { getSubmissionWithRoast } from "@/db/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getSubmissionWithRoast(id);

  if (!result) {
    return {
      title: "Roast Results - Devroast",
      description: "Your code has been roasted",
    };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/og?submissionId=${id}`;

  return {
    title: `Roast Results - Devroast`,
    description: `${result.roastTitle} — Score: ${result.score}/10`,
    openGraph: {
      title: `devroast — ${result.roastTitle}`,
      description: `Score: ${result.score}/10 · Verdict: ${result.verdict} · ${result.language}, ${result.lineCount} lines`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Roast result for ${result.language} code`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `devroast — ${result.roastTitle}`,
      description: `Score: ${result.score}/10 · Verdict: ${result.verdict} · ${result.language}, ${result.lineCount} lines`,
      images: [ogImageUrl],
    },
  };
}

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
  const suggestions = result.suggestions as Array<{ diff: string }> | null;

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
              variant={score < 4 ? "critical" : score < 7 ? "warning" : "good"}
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
              {"//"}
            </span>
            <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
              your_submission
            </h2>
          </div>
          <CodeBlock code={result.code} language={result.language} />
        </section>

        {/* Detailed Analysis */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono text-[#10B981]">
              {"//"}
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
              {"//"}
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
                code={suggestions?.[0]?.diff ?? "No suggestions"}
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
