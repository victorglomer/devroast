import { router } from "../init";
import { leaderboardRouter } from "./leaderboard";
import { metricsRouter } from "./metrics";
import { roastRouter } from "./roast";

export const appRouter = router({
  metrics: metricsRouter,
  leaderboard: leaderboardRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
