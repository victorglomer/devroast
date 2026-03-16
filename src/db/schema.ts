import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const programmingLanguageEnum = pgEnum("programming_language", [
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
]);

export const roastModeEnum = pgEnum("roast_mode", ["normal", "roast"]);

export const severityLevelEnum = pgEnum("severity_level", [
  "critical",
  "warning",
  "good",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  code: text("code").notNull(),
  language: programmingLanguageEnum("language").notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("normal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id)
    .unique(),
  verdict: varchar("verdict", { length: 50 }).notNull(),
  roastTitle: text("roast_title").notNull(),
  score: decimal("score", { precision: 3, scale: 1 }).notNull(),
  lineCount: integer("line_count").notNull(),
  issues: jsonb("issues").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  roast: one(roasts),
}));

export const roastsRelations = relations(roasts, ({ one }) => ({
  submission: one(submissions, {
    fields: [roasts.submissionId],
    references: [submissions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
