# Leaderboard Page with tRPC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock data on `/leaderboard` with real data from a tRPC procedure, following the homepage ShameLeaderboard pattern.

**Architecture:** New tRPC router `leaderboard` with a `getTop` procedure that queries the top 20 roasts (JOIN submissions + roasts + users, ORDER BY score ASC). The leaderboard page becomes a client component using `useQuery` with a loading skeleton.

**Tech Stack:** tRPC v11, TanStack React Query v5, Drizzle ORM + PostgreSQL, NumberFlow, Tailwind CSS v4

---

### Task 1: Create leaderboard tRPC router

**Files:**
- Create: `src/trpc/routers/leaderboard.ts`
- Modify: `src/trpc/routers/_app.ts`

- [ ] **Create `src/trpc/routers/leaderboard.ts`**

```ts
import { z } from "zod";
import { sql } from "drizzle-orm";
import { router, publicProcedure } from "../init";
import { roasts } from "@/db/schema";

export interface LeaderboardEntry {
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
```

- [ ] **Add leaderboardRouter to `src/trpc/routers/_app.ts`**

Edit the file to import and add `leaderboard`:

```ts
import { router } from '../init';
import { metricsRouter } from './metrics';
import { leaderboardRouter } from './leaderboard';

export const appRouter = router({
  metrics: metricsRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
```

- [ ] **Verify the project compiles**

Run: `pnpm run typecheck`
Expected: No type errors.

- [ ] **Commit**

```bash
git add src/trpc/routers/leaderboard.ts src/trpc/routers/_app.ts
git commit -m "feat: add leaderboard tRPC router with getTop procedure"
```

---

### Task 2: Convert leaderboard page to client component with real data

**Files:**
- Modify: `src/app/leaderboard/page.tsx`

Replace the entire file. The page becomes a client component that:
1. Uses `trpc.leaderboard.getTop.useQuery()` to fetch 20 items
2. Shows a loading skeleton while fetching
3. Displays the leaderboard entries with CodeBlock for full code
4. Shows metrics (total submissions, avg score) with NumberFlow for animation

- [ ] **Rewrite `src/app/leaderboard/page.tsx`**

```tsx
"use client";

import NumberFlow from "@number-flow/react";
import { trpc } from "@/trpc/client";
import { CodeBlock } from "@/components/ui/code-block";

export default function LeaderboardPage() {
  const { data, isLoading } = trpc.leaderboard.getTop.useQuery({ limit: 20 });

  const totalSubmissions = data?.totalSubmissions ?? 0;
  const avgScore = data?.avgScore ?? "0";
  const entries = data?.entries ?? [];

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
          {isLoading ? (
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
                avg score:{" "}
                <NumberFlow value={Number.parseFloat(avgScore)} />/10
              </span>
            </div>
          )}
        </section>

        {/* Leaderboard Entries */}
        <div className="flex flex-col gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
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
            : entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col rounded-md border border-[#2A2A2A] overflow-hidden bg-[#0F0F0F]"
                >
                  {/* Meta Row */}
                  <div className="flex items-center justify-between h-12 px-5 border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-mono text-[#4B5563]">#</span>
                        <span className="text-sm font-bold font-mono text-[#F59E0B]">
                          {entries.indexOf(entry) + 1}
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
              ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Run typecheck to verify**

Run: `pnpm run typecheck`
Expected: No type errors.

- [ ] **Commit**

```bash
git add src/app/leaderboard/page.tsx
git commit -m "feat: connect leaderboard page to tRPC backend with loading skeleton"
```

---

### Task 4: Final verification

- [ ] **Run lint**

Run: `pnpm run lint`
Expected: No lint errors.

- [ ] **Run typecheck**

Run: `pnpm run typecheck`
Expected: No type errors.

- [ ] **Final commit**

```bash
git add -A
git commit -m "chore: final adjustments after leaderboard implementation"
```
