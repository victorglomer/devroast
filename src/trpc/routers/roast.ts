import { z } from "zod";
import { createRoast, createSubmission, getUserByUsername } from "@/db/queries";
import { users } from "@/db/schema";
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
          .returning();

        if (!newUser) {
          throw new Error("Failed to create user");
        }

        user = {
          id: newUser.id,
          username: newUser.username,
          createdAt: newUser.createdAt,
        };
      }

      const submissionId = await createSubmission({
        userId: user.id,
        code: input.code,
        language: input.language,
        roastMode: input.roastMode,
      });

      if (!submissionId) {
        throw new Error("Failed to create submission");
      }

      const analysis = await analyzeCode(input.code, input.roastMode);

      await createRoast({
        submissionId,
        verdict: analysis.verdict,
        roastTitle: analysis.roastTitle,
        score: analysis.score.toFixed(1),
        lineCount: analysis.lineCount,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      });

      return {
        submissionId,
        score: analysis.score,
        verdict: analysis.verdict,
        roastTitle: analysis.roastTitle,
        lineCount: analysis.lineCount,
        issues: analysis.issues,
        suggestions: analysis.suggestions,
      };
    }),
});
