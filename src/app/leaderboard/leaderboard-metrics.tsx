"use client";

import NumberFlow from "@number-flow/react";

interface LeaderboardMetricsProps {
  totalSubmissions: number;
  avgScore: string;
}

export function LeaderboardMetrics({
  totalSubmissions,
  avgScore,
}: LeaderboardMetricsProps) {
  return (
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
  );
}
