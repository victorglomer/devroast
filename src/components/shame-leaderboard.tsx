import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getLeaderboard } from "@/db/queries";
import { roasts } from "@/db/schema";

export async function ShameLeaderboard() {
  const [leaderboard, metricsResult] = await Promise.all([
    getLeaderboard(3),
    db
      .select({
        totalRoasts: sql<number>`count(*)`,
        avgScore: sql<string>`round(avg(${roasts.score})::numeric, 1)::text`,
      })
      .from(roasts),
  ]);

  const totalRoasts = metricsResult[0]?.totalRoasts ?? 0;
  const avgScore = metricsResult[0]?.avgScore ?? "0";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> shame_leaderboard
        </h2>
        <a
          href="/leaderboard"
          className="px-3 py-1.5 text-xs font-mono text-[#6B7280] border border-[#2A2A2A] rounded hover:text-[#FAFAFA] transition-colors"
        >
          view all &gt;&gt;
        </a>
      </div>

      <p className="text-xs font-mono text-[#4B5563]">
        {"// the worst code on the internet, ranked by shame"}
      </p>

      <div className="flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
        <div className="flex items-center h-10 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <span className="w-[50px] text-xs font-mono text-[#6B7280]">
            rank
          </span>
          <span className="w-[70px] text-xs font-mono text-[#6B7280]">
            score
          </span>
          <span className="flex-1 text-xs font-mono text-[#6B7280]">code</span>
          <span className="w-[100px] text-xs font-mono text-[#6B7280]">
            lang
          </span>
        </div>

        {leaderboard.length > 0 ? (
          leaderboard.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center px-5 py-4 border-b border-[#2A2A2A] last:border-b-0"
            >
              <span className="w-[50px] text-sm font-mono text-[#6B7280]">
                #{index + 1}
              </span>
              <span className="w-[70px] text-sm font-bold font-mono text-[#EF4444]">
                {row.score}
              </span>
              <span className="flex-1 text-sm font-mono text-[#6B7280] truncate">
                {row.code.split("\n")[0]}
              </span>
              <span className="w-[100px] text-xs font-mono text-[#4B5563]">
                {row.language}
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center px-5 py-4 text-sm font-mono text-[#4B5563]">
            No submissions yet. Be the first!
          </div>
        )}

        <div className="flex items-center gap-8 px-5 py-4 border-t border-[#2A2A2A] bg-[#0F0F0F]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
              Total Roasted
            </span>
            <span className="text-3xl font-bold font-mono text-[#FAFAFA]">
              {totalRoasts.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-10 bg-[#2A2A2A]" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
              Avg Score
            </span>
            <span className="text-3xl font-bold font-mono text-[#F59E0B]">
              {avgScore}
              <span className="text-lg text-[#4B5563]">/10</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
