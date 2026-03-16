import Link from "next/link";
import { getLeaderboard } from "@/db/queries";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard(20);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col gap-8 py-10 px-20">
      {/* Nav */}
      <nav className="flex items-center justify-between h-14 px-10 border-b border-[#2A2A2A]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#10B981] font-mono font-bold">{"//"}</span>
          <span className="text-[#FAFAFA] font-mono">devroast</span>
        </Link>
        <Link
          href="/"
          className="text-[#6B7280] font-mono text-sm hover:text-[#FAFAFA]"
        >
          submit code
        </Link>
      </nav>

      {/* Header */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> shame_leaderboard
        </h1>
        <p className="text-sm font-mono text-[#4B5563]">
          {"// the worst code on the internet, ranked by shame"}
        </p>
      </section>

      {/* Table */}
      <div className="flex flex-col rounded-lg border border-[#2A2A2A] overflow-hidden">
        {/* Header */}
        <div className="flex items-center h-12 px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <span className="w-[60px] text-xs font-mono text-[#6B7280]">
            rank
          </span>
          <span className="w-[80px] text-xs font-mono text-[#6B7280]">
            score
          </span>
          <span className="w-[120px] text-xs font-mono text-[#6B7280]">
            author
          </span>
          <span className="flex-1 text-xs font-mono text-[#6B7280]">code</span>
          <span className="w-[100px] text-xs font-mono text-[#6B7280]">
            lang
          </span>
        </div>

        {/* Rows */}
        {leaderboard.length > 0 ? (
          leaderboard.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center px-5 py-4 border-b border-[#2A2A2A] last:border-b-0 hover:bg-[#0F0F0F] transition-colors"
            >
              <span className="w-[60px] text-sm font-mono text-[#6B7280]">
                #{index + 1}
              </span>
              <span className="w-[80px] text-sm font-bold font-mono text-[#EF4444]">
                {row.score}
              </span>
              <span className="w-[120px] text-sm font-mono text-[#6B7280]">
                {row.username}
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
          <div className="flex items-center px-5 py-8 text-sm font-mono text-[#4B5563]">
            No submissions yet. Be the first to get roasted!
          </div>
        )}
      </div>
    </div>
  );
}
