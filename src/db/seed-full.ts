import { faker } from "@faker-js/faker";
import postgres from "postgres";

const connectionString =
  "postgresql://devroast:devroast123@localhost:5432/devroast";
const client = postgres(connectionString);

const usernames = [
  "victorvhvhvh",
  "codigoRuim",
  "devC肇endente",
  "jesusChrist",
  "naoSeiProgramar",
  "copyPasteMaster",
  "spaghettiDev",
  "bugMachine",
  "funcional全域",
  "naoTestaNada",
];

const languages = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "ruby",
  "php",
];

const verdicts = [
  "needs_serious_help",
  "barely_survivable",
  "code_is_cringe",
  "please_seek_help",
  "painful_to_read",
  "absolute_disaster",
  "compiler_cried",
  "why_tho",
  "reset_your_career",
  "delete_and_try_again",
];

const roastTitles = [
  "this code looks like it was written during a power outage... in 2005.",
  "i've seen better code in a hello world tutorial.",
  "your code is so bad it made my compiler cry.",
  "please, for the love of all that is holy, use a linter.",
  "this is why we can't have nice things in production.",
  "my grandma codes better than this, and she's been dead for 20 years.",
  "this code has more bugs than a summer picnic.",
  "i'm literally crying right now. from laughter.",
  "please submit this to a museum of bad code.",
  "have you considered... not coding?",
  "this is an insult to every programming language ever created.",
  "the indentations are giving me schizophrenia.",
  "who hurt you? who wrote this code?",
  "this is the coding equivalent of eating tide pods.",
  "my vscode crashed just by looking at this.",
];

const issueTitles = [
  "Using var instead of const/let",
  "Console.log in production code",
  "Using eval() - dangerous!",
  "No error handling",
  "Magic numbers everywhere",
  "Functions doing too much",
  "No comments in complex code",
  "Using == instead of ===",
  "Global variables pollution",
  "No input validation",
  "Synchronous operations in main thread",
  "Nested callbacks hell",
  "No type definitions",
  "Hardcoded credentials",
  "SQL injection vulnerable",
  "Memory leak detected",
  "No unit tests",
  "Code duplication",
  "Inconsistent naming",
  "No separation of concerns",
];

const severities = ["critical", "warning", "good"];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIssue() {
  return {
    title: randomElement(issueTitles),
    description: faker.lorem.sentence(),
    severity: randomElement(severities),
    line_number: faker.number.int({ min: 1, max: 100 }),
  };
}

function generateIssues() {
  const count = faker.number.int({ min: 2, max: 6 });
  const issues = [];
  for (let i = 0; i < count; i++) {
    issues.push(generateIssue());
  }
  return issues;
}

function generateSuggestion() {
  return {
    filename: `code.${randomElement(["js", "ts", "py", "rs", "go"])}`,
    diff: faker.lorem.paragraph(),
  };
}

async function seed() {
  console.log("🌱 Starting seed...");

  console.log("Creating users...");
  const userIds: string[] = [];

  for (const username of usernames) {
    const result = await client`
      INSERT INTO users (username)
      VALUES (${username})
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING id
    `;
    userIds.push(result[0].id);
  }
  console.log(`Created ${userIds.length} users`);

  console.log("Creating 50 roasts...");

  for (let i = 0; i < 50; i++) {
    const userId = randomElement(userIds);
    const code = faker.lorem.lines({ min: 3, max: 15 });
    const language = randomElement(languages);
    const roastMode = randomElement(["normal", "roast"]);
    const score = (Math.random() * 10).toFixed(1);
    const lineCount = code.split("\n").length;
    const verdict = randomElement(verdicts);
    const roastTitle = randomElement(roastTitles);
    const issues = generateIssues();
    const suggestions = [generateSuggestion()];

    await client`
      INSERT INTO submissions (user_id, code, language, roast_mode)
      VALUES (${userId}, ${code}, ${language}, ${roastMode})
    `;

    const subResult = await client`
      SELECT id FROM submissions ORDER BY created_at DESC LIMIT 1
    `;
    const submissionId = subResult[0].id;

    await client`
      INSERT INTO roasts (submission_id, verdict, roast_title, score, line_count, issues, suggestions)
      VALUES (
        ${submissionId},
        ${verdict},
        ${roastTitle},
        ${score},
        ${lineCount},
        ${JSON.stringify(issues)},
        ${JSON.stringify(suggestions)}
      )
    `;

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/50 roasts...`);
    }
  }

  console.log("✅ Seed completed!");
  console.log(`📊 50 roasts created with users: ${usernames.join(", ")}`);

  await client.end();
}

seed().catch(console.error);
