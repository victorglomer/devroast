import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { getSubmissionWithRoast } from "@/db/queries";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  const submission = await getSubmissionWithRoast(id);

  if (!submission) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-[#FAFAFA] mb-4">
            Submission not found
          </h1>
          <Link href="/">
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const issues = submission.issues as Array<{
    title: string;
    description: string;
    severity: string;
    line_number: number | null;
  }>;

  const score = parseFloat(submission.score);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col gap-10 py-10 px-20">
      {/* Nav */}
      <nav className="flex items-center justify-between h-14 px-10 border-b border-[#2A2A2A]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#10B981] font-mono font-bold">{"//"}</span>
          <span className="text-[#FAFAFA] font-mono">devroast</span>
        </Link>
        <Link
          href="/leaderboard"
          className="text-[#6B7280] font-mono text-sm hover:text-[#FAFAFA]"
        >
          leaderboard
        </Link>
      </nav>

      {/* Score Hero */}
      <section className="flex items-center justify-center gap-12">
        <ScoreRing score={score} size={180} />
        <div className="flex flex-col gap-4">
          <Badge
            variant={score < 4 ? "critical" : score < 7 ? "warning" : "good"}
          >
            verdict: {submission.verdict}
          </Badge>
          <p className="text-xl font-mono text-[#FAFAFA] max-w-md">
            &quot;{submission.roastTitle}&quot;
          </p>
          <div className="flex items-center gap-4 text-sm font-mono text-[#6B7280]">
            <span>lang: {submission.language}</span>
            <span>·</span>
            <span>{submission.lineCount} lines</span>
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> your_submission
        </h2>
        <div className="rounded-lg border border-[#2A2A2A] overflow-hidden">
          <CodeBlock
            code={submission.code}
            filename={`code.${submission.language === "javascript" ? "js" : submission.language}`}
          />
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> detailed_analysis
        </h2>
        <div className="grid grid-cols-2 gap-5">
          {issues.map((issue) => (
            <div
              key={issue.title}
              className="p-5 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]"
            >
              <div className="flex items-center gap-2 mb-3">
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
                  className={`text-xs font-mono ${
                    issue.severity === "critical"
                      ? "text-[#EF4444]"
                      : issue.severity === "warning"
                        ? "text-[#F59E0B]"
                        : "text-[#10B981]"
                  }`}
                >
                  {issue.severity}
                </span>
                {issue.line_number && (
                  <span className="text-xs font-mono text-[#4B5563]">
                    line {issue.line_number}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-mono text-[#FAFAFA] mb-2">
                {issue.title}
              </h3>
              <p className="text-xs font-mono text-[#6B7280]">
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Link href="/">
          <Button variant="outline">Roast Another</Button>
        </Link>
      </div>
    </div>
  );
}
