import { router, publicProcedure } from '../init';
import { sql } from 'drizzle-orm';
import { roasts } from '@/db/schema';

export interface Metrics {
  totalRoasts: number;
  avgScore: string;
}

export const metricsRouter = router({
  getMetrics: publicProcedure.query(async ({ ctx }): Promise<Metrics> => {
    const result = await ctx.db
      .select({
        totalRoasts: sql<number>`count(*)`,
        avgScore: sql<string>`avg(${roasts.score})::text`,
      })
      .from(roasts);

    const totalRoasts = result[0]?.totalRoasts ?? 0;
    const avgScore = result[0]?.avgScore ?? '0';

    return {
      totalRoasts,
      avgScore: parseFloat(avgScore).toFixed(1),
    };
  }),
});
