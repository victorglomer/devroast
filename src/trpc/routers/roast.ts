import { z } from "zod";
import { getUserByUsername } from "@/db/queries";
import { roasts, submissions, users } from "@/db/schema";
import { analyzeCode } from "@/lib/gemini";
import { publicProcedure, router } from "../init";

const MOCK_USERNAME = "victorvhvhvh";

const programmingLanguages = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "csharp",
  "sql",
] as const;

export const roastRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Code is required"),
        language: z.enum(programmingLanguages).default("javascript"),
        roastMode: z.enum(["normal", "roast"]).default("roast"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let user = await getUserByUsername(MOCK_USERNAME);

      if (!user) {
        const [newUser] = await ctx.db
          .insert(users)
          .values({ username: MOCK_USERNAME })
          .onConflictDoNothing()
          .returning();

        if (newUser) {
          user = {
            id: newUser.id,
            username: newUser.username,
            createdAt: newUser.createdAt,
          };
        } else {
          user = await getUserByUsername(MOCK_USERNAME);
          if (!user) {
            throw new Error("Failed to create user");
          }
        }
      }

      const analysis = await analyzeCode(input.code, input.roastMode);

      const [submission] = await ctx.db.transaction(async (tx) => {
        const [sub] = await tx
          .insert(submissions)
          .values({
            userId: user.id,
            code: input.code,
            language: input.language,
            roastMode: input.roastMode,
          })
          .returning({ id: submissions.id });

        await tx.insert(roasts).values({
          submissionId: sub.id,
          verdict: analysis.verdict,
          roastTitle: analysis.roastTitle,
          score: analysis.score.toFixed(1),
          lineCount: analysis.lineCount,
          issues: analysis.issues,
          suggestions: analysis.suggestions,
        });

        return [sub];
      });

      return {
        submissionId: submission.id,
        score: analysis.score,
        verdict: analysis.verdict,
        roastTitle: analysis.roastTitle,
        lineCount: analysis.lineCount,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      };
    }),
});
