"use client";

import NumberFlow from "@number-flow/react";
import { CodeBlock } from "@/components/ui/code-block";
import { trpc } from "@/trpc/client";

export default function LeaderboardPage() {
  const { data, isPending } = trpc.leaderboard.getTop.useQuery({ limit: 20 });

  const totalSubmissions = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? "0";
  const entries = data?.entries ?? [];

  if (!data && !isPending) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-sm font-mono text-[#EF4444]">
          Failed to load leaderboard. Try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold font-mono text-[#10B981]">
              &gt;
            </span>
            <h1 className="text-3xl font-bold font-mono text-[#FAFAFA]">
              shame_leaderboard
            </h1>
          </div>
          {isPending ? (
            <div className="flex items-center gap-2 text-xs font-mono text-[#4B5563]">
              <div className="h-4 w-32 bg-[#2A2A2A] rounded animate-pulse" />
              <span>·</span>
              <div className="h-4 w-28 bg-[#2A2A2A] rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-[#4B5563]">
              <span>
                <NumberFlow value={totalSubmissions} /> submissions
              </span>
              <span>·</span>
              <span>
                avg score: <NumberFlow value={Number.parseFloat(avgScore)} />
                /10
              </span>
            </div>
          )}
        </section>

        {/* Leaderboard Entries */}
        <div className="flex flex-col gap-5">
          {isPending ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden bg-[#0F0F0F]"
              >
                <div className="flex items-center justify-between h-12 px-5 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-4">
                    <div className="h-5 w-16 bg-[#2A2A2A] rounded animate-pulse" />
                    <div className="h-5 w-16 bg-[#2A2A2A] rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded animate-pulse" />
                    <div className="h-4 w-16 bg-[#2A2A2A] rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-20 bg-[#2A2A2A] animate-pulse mx-5 my-4 rounded" />
              </div>
            ))
          ) : entries.length === 0 ? (
            <div className="flex items-center justify-center px-5 py-8 border border-[#2A2A2A] rounded-md bg-[#0F0F0F]">
              <p className="text-sm font-mono text-[#4B5563]">
                No submissions yet. Be the first!
              </p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden bg-[#0F0F0F]"
              >
                {/* Meta Row */}
                <div className="flex items-center justify-between h-12 px-5 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono text-[#4B5563]">
                        #
                      </span>
                      <span className="text-sm font-bold font-mono text-[#F59E0B]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-[#4B5563]">
                        score:
                      </span>
                      <span className="text-sm font-bold font-mono text-[#EF4444]">
                        {entry.score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#6B7280]">
                      {entry.username}
                    </span>
                    <span className="text-xs font-mono text-[#6B7280]">
                      {entry.language}
                    </span>
                    <span className="text-xs font-mono text-[#4B5563]">
                      {entry.lineCount} lines
                    </span>
                  </div>
                </div>

                {/* Code Block */}
                <CodeBlock
                  code={entry.code}
                  language={entry.language}
                  showHeader={false}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
