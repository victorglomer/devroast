export function ShameLeaderboardSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold font-mono text-[#FAFAFA]">
          <span className="text-[#10B981]">{"//"}</span> shame_leaderboard
        </h2>
        <div className="h-8 w-20 bg-[#2A2A2A] rounded animate-pulse" />
      </div>

      <div className="h-4 w-80 bg-[#2A2A2A] rounded animate-pulse" />

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

        <div className="flex items-center px-5 py-4 border-b border-[#2A2A2A]">
          <div className="w-[50px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="w-[70px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="flex-1 h-4 bg-[#2A2A2A] rounded animate-pulse mx-2" />
          <div className="w-[100px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
        </div>
        <div className="flex items-center px-5 py-4 border-b border-[#2A2A2A]">
          <div className="w-[50px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="w-[70px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="flex-1 h-4 bg-[#2A2A2A] rounded animate-pulse mx-2" />
          <div className="w-[100px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
        </div>
        <div className="flex items-center px-5 py-4 border-b border-[#2A2A2A] last:border-b-0">
          <div className="w-[50px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="w-[70px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
          <div className="flex-1 h-4 bg-[#2A2A2A] rounded animate-pulse mx-2" />
          <div className="w-[100px] h-4 bg-[#2A2A2A] rounded animate-pulse" />
        </div>

        <div className="flex items-center gap-8 px-5 py-4 border-t border-[#2A2A2A] bg-[#0F0F0F]">
          <div className="flex flex-col gap-1">
            <div className="h-3 w-24 bg-[#2A2A2A] rounded animate-pulse" />
            <div className="h-9 w-20 bg-[#2A2A2A] rounded animate-pulse" />
          </div>
          <div className="w-px h-10 bg-[#2A2A2A]" />
          <div className="flex flex-col gap-1">
            <div className="h-3 w-20 bg-[#2A2A2A] rounded animate-pulse" />
            <div className="h-9 w-16 bg-[#2A2A2A] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
