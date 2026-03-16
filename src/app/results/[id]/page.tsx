import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata = {
  title: "Roast Results - Devroast",
  description: "Your code has been roasted",
};

const MOCK_RESULT = {
  id: "1",
  score: 3.5,
  verdict: "needs_serious_help",
  roastTitle:
    "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lineCount: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`,
  issues: [
    {
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
      severity: "critical",
      lineNumber: 3,
    },
    {
      title: "imperative loop pattern",
      description:
        "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
      severity: "warning",
      lineNumber: 3,
    },
    {
      title: "clear naming conventions",
      description:
        "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
      severity: "good",
      lineNumber: null,
    },
    {
      title: "single responsibility",
      description:
        "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
      severity: "good",
      lineNumber: null,
    },
  ],
  diff: `function calculateTotal(items) {
-  var total = 0;
-  for (var i = 0; i < items.length; i++) {
-    total = total + items[i].price;
-  }
-  if (total > 100) {
-    console.log("discount applied");
-    total = total * 0.9;
-  }
+  const total = items.reduce((sum, item) => sum + item.price, 0);
+  
+  if (total > 100) {
+    console.log("discount applied");
+    return total * 0.9;
+  }
+  
   // TODO: handle tax calculation
   // TODO: handle currency conversion
-  return total;
+  return total;
 }`,
};

export default async function ResultsPage() {
  const result = MOCK_RESULT;

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
          <ScoreRing score={result.score} size={180} />
          <div className="flex flex-col gap-4 max-w-md">
            <Badge
              variant={
                result.score < 4
                  ? "critical"
                  : result.score < 7
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
            {result.issues.map((issue) => (
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
            <div className="flex flex-col py-1">
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#FAFAFA]">
                  function calculateTotal(items) {"{"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#EF4444]/10">
                <span className="text-sm font-mono text-[#EF4444]">
                  - var total = 0;
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#EF4444]/10">
                <span className="text-sm font-mono text-[#EF4444]">
                  - for (var i = 0; i {"<"} items.length; i++) {"{"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#EF4444]/10">
                <span className="text-sm font-mono text-[#EF4444]">
                  - total = total + items[i].price;
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#EF4444]/10">
                <span className="text-sm font-mono text-[#EF4444]">
                  {"}"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#EF4444]/10">
                <span className="text-sm font-mono text-[#EF4444]">
                  - if (total {" > "} 100) {"{"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#10B981]/10">
                <span className="text-sm font-mono text-[#10B981]">
                  + const total = items.reduce((sum, item) ={">"} sum +
                  item.price, 0);
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#FAFAFA]">
                  +
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#10B981]/10">
                <span className="text-sm font-mono text-[#10B981]">
                  + if (total {" > "} 100) {"{"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#10B981]/10">
                <span className="text-sm font-mono text-[#10B981]">
                  + console.log(&quot;discount applied&quot;);
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#10B981]/10">
                <span className="text-sm font-mono text-[#10B981]">
                  + return total * 0.9;
                </span>
              </div>
              <div className="flex items-center h-7 px-4 bg-[#10B981]/10">
                <span className="text-sm font-mono text-[#10B981]">
                  {"}"}
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#FAFAFA]">
                  +
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#6B7280]">
                  {'// TODO: handle tax calculation'}
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#6B7280]">
                  {'// TODO: handle currency conversion'}
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#FAFAFA]">
                  - return total;
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#10B981]">
                  + return total;
                </span>
              </div>
              <div className="flex items-center h-7 px-4">
                <span className="text-sm font-mono text-[#FAFAFA]">{"}"}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
