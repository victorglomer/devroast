import { sql } from "drizzle-orm";
import { db } from "./index";

interface SubmissionWithRoast {
  [key: string]: unknown;
  id: string;
  userId: string;
  code: string;
  language: string;
  roastMode: string;
  createdAt: Date;
  username: string;
  verdict: string;
  roastTitle: string;
  score: string;
  lineCount: number;
  issues: unknown;
  suggestions: unknown;
}

interface LeaderboardItem {
  [key: string]: unknown;
  id: string;
  code: string;
  language: string;
  score: string;
  verdict: string;
  username: string;
  createdAt: Date;
}

export async function getSubmissionWithRoast(submissionId: string) {
  const result = await db.execute<SubmissionWithRoast>(sql`
    SELECT 
      s.*,
      u.username,
      r.verdict,
      r.roast_title as "roastTitle",
      r.score,
      r.line_count as "lineCount",
      r.issues,
      r.suggestions
    FROM submissions s
    JOIN roasts r ON r.submission_id = s.id
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ${submissionId}
  `);
  return result[0] || null;
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardItem[]> {
  const result = await db.execute<LeaderboardItem>(sql`
    SELECT 
      s.id,
      s.code,
      s.language,
      r.score,
      r.verdict,
      u.username,
      r.created_at as "createdAt"
    FROM submissions s
    JOIN roasts r ON r.submission_id = s.id
    JOIN users u ON u.id = s.user_id
    ORDER BY r.score ASC
    LIMIT ${limit}
  `);
  return result;
}

export async function createSubmission(data: {
  userId: string;
  code: string;
  language: string;
  roastMode: "normal" | "roast";
}) {
  const result = await db.execute<{ id: string }>(sql`
    INSERT INTO submissions (user_id, code, language, roast_mode)
    VALUES (${data.userId}, ${data.code}, ${data.language}, ${data.roastMode})
    RETURNING id
  `);
  return result[0]?.id;
}

export async function createRoast(data: {
  submissionId: string;
  verdict: string;
  roastTitle: string;
  score: string;
  lineCount: number;
  issues: unknown;
  suggestions: unknown;
}) {
  await db.execute(sql`
    INSERT INTO roasts (submission_id, verdict, roast_title, score, line_count, issues, suggestions)
    VALUES (
      ${data.submissionId},
      ${data.verdict},
      ${data.roastTitle},
      ${data.score},
      ${data.lineCount},
      ${JSON.stringify(data.issues)},
      ${JSON.stringify(data.suggestions)}
    )
  `);
}

export async function getUserByUsername(username: string) {
  const result = await db.execute<{
    id: string;
    username: string;
    createdAt: Date;
  }>(sql`
    SELECT id, username, created_at as "createdAt"
    FROM users
    WHERE username = ${username}
  `);
  return result[0] as { id: string; username: string; createdAt: Date } | null;
}
