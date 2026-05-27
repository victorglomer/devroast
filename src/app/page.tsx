import { Suspense } from "react";
import { HeroSection } from "@/components/hero-section";
import { ShameLeaderboard } from "@/components/shame-leaderboard";
import { ShameLeaderboardSkeleton } from "@/components/shame-leaderboard-skeleton";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-20 px-10">
      <HeroSection />

      <Suspense fallback={<ShameLeaderboardSkeleton />}>
        <ShameLeaderboard />
      </Suspense>
    </div>
  );
}
