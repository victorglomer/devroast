import { sql } from "drizzle-orm";
import { z } from "zod";
import { roasts } from "@/db/schema";
import { publicProcedure, router } from "../init";

export interface LeaderboardEntry extends Record<string, unknown> {
  id: string;
  code: string;
  language: string;
  score: string;
  verdict: string;
  username: string;
  lineCount: number;
  createdAt: Date;
}

export interface GetTopResponse {
  entries: LeaderboardEntry[];
  totalSubmissions: number;
  avgScore: string;
}

export const leaderboardRouter = router({
  getTop: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }): Promise<GetTopResponse> => {
      const [entries, metricsResult] = await Promise.all([
        ctx.db.execute<LeaderboardEntry>(sql`
          SELECT
            s.id,
            s.code,
            s.language,
            r.score,
            r.verdict,
            u.username,
            r.line_count as "lineCount",
            r.created_at as "createdAt"
          FROM submissions s
          JOIN roasts r ON r.submission_id = s.id
          JOIN users u ON u.id = s.user_id
          ORDER BY r.score ASC
          LIMIT ${input.limit}
        `),
        ctx.db
          .select({
            totalSubmissions: sql<number>`count(*)`,
            avgScore: sql<string>`round(avg(${roasts.score})::numeric, 1)::text`,
          })
          .from(roasts),
      ]);

      const totalSubmissions = metricsResult[0]?.totalSubmissions ?? 0;
      const avgScore = metricsResult[0]?.avgScore ?? "0";

      return { entries, totalSubmissions, avgScore };
    }),
});
