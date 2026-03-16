# Especificação de Banco de Dados - Devroast

## Visão Geral

- **Projeto**: Devroast - Plataforma de code reviews com humor
- **Stack DB**: PostgreSQL + Drizzle ORM
- **Autenticação**: Não há (submissão anônima com username mockado)
- **Usuário padrão**: `victorvhvhvh`

---

## Enums

```typescript
// src/db/schema/enums.ts
export const programmingLanguageEnum = pgEnum('programming_language', [
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'csharp',
  'sql',
]);

export const roastModeEnum = pgEnum('roast_mode', [
  'normal',
  'roast',
]);

export const severityLevelEnum = pgEnum('severity_level', [
  'critical',
  'warning',
  'good',
]);
```

---

## Tabelas

### `users`

Usuários que submetem código (mockados no início).

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| username | varchar(100) | NOT NULL, UNIQUE |
| created_at | timestamp | NOT NULL, DEFAULT now() |

---

### `submissions`

Códigos submetidos para avaliação.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users(id) |
| code | text | NOT NULL |
| language | programming_language | NOT NULL |
| roast_mode | roast_mode | NOT NULL, DEFAULT 'normal' |
| created_at | timestamp | NOT NULL, DEFAULT now() |

> **Nota**: Índice em `user_id` criado automaticamente pelo PostgreSQL para FK.

---

### `roasts`

Avaliações completas geradas pela IA para cada submissão.

| Coluna | Tipo | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| submission_id | uuid | FK → submissions(id), UNIQUE |
| verdict | varchar(50) | NOT NULL |
| roast_title | text | NOT NULL |
| score | decimal(3,1) | NOT NULL |
| line_count | integer | NOT NULL |
| issues | jsonb | NOT NULL |
| suggestions | jsonb | NOT NULL |
| created_at | timestamp | NOT NULL, DEFAULT now() |

---

## Estrutura dos Campos JSON

### `issues` (jsonb)

```typescript
type Issue = {
  title: string;           // ex: "Using var instead of const"
  description: string;     // ex: "The var keyword is function-scoped..."
  severity: 'critical' | 'warning' | 'good';
  line_number: number | null;
};

type Issues = Issue[];
```

### `suggestions` (jsonb)

```typescript
type Suggestion = {
  filename: string;
  diff: string;            // diff formatado
};

type Suggestions = Suggestion[];
```

---

## Relações

```
users 1──∞ submissions
submissions 1──1 roasts
```

> **Nota sobre índices**: PostgreSQL cria automaticamente índices para PKs e FKs. Não há necessidade de criar índices explícitos.

---

## Queries (SQL Puro)

Para queries complexas com JOINs, usar SQL puro com `db.execute()`:

```typescript
// src/db/queries.ts
import { db } from './index';
import { sql } from 'drizzle-orm';

// Buscar submission com roast e usuário
const getSubmissionWithRoast = async (submissionId: string) => {
  const result = await db.execute(sql`
    SELECT 
      s.*,
      r.verdict,
      r.roast_title,
      r.score,
      r.line_count,
      r.issues,
      r.suggestions,
      u.username
    FROM submissions s
    JOIN roasts r ON r.submission_id = s.id
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ${submissionId}
  `;
  return result.rows[0];
};

// Leaderboard - top piores scores
const getLeaderboard = async (limit = 10) => {
  const result = await db.execute(sql`
    SELECT 
      s.id,
      s.code,
      s.language,
      r.score,
      r.verdict,
      u.username,
      r.created_at
    FROM submissions s
    JOIN roasts r ON r.submission_id = s.id
    JOIN users u ON u.id = s.user_id
    ORDER BY r.score ASC
    LIMIT ${limit}
  `;
  return result.rows;
};
```

---

## Docker Compose

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast123
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Configuração Drizzle

### Dependências

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

### Estrutura de arquivos

```
src/
  db/
    index.ts        # conexão com banco
    schema.ts       # definições tables + enums
    seed.ts         # dados iniciais
    migrations/     # migrations geradas
```

---

## Schema Drizzle

### Configuração de Casing

Usar `casing: 'camel'` no drizzle.config.ts. O Drizzle converte automaticamente `createdAt` → `created_at` no banco.

---

```typescript
// src/db/schema.ts
import { pgEnum, pgTable, uuid, varchar, text, timestamp, decimal, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const programmingLanguageEnum = pgEnum('programming_language', [
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'csharp',
  'sql',
]);

export const roastModeEnum = pgEnum('roast_mode', ['normal', 'roast']);

export const severityLevelEnum = pgEnum('severity_level', ['critical', 'warning', 'good']);

// Tables - camelCase nos campos, Drizzle converte para snake_case no DB
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  code: text('code').notNull(),
  language: programmingLanguageEnum('language').notNull(),
  roastMode: roastModeEnum('roast_mode').notNull().default('normal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const roasts = pgTable('roasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').notNull().references(() => submissions.id).unique(),
  verdict: varchar('verdict', { length: 50 }).notNull(),
  roastTitle: text('roast_title').notNull(),
  score: decimal('score', { precision: 3, scale: 1 }).notNull(),
  lineCount: integer('line_count').notNull(),
  issues: jsonb('issues').notNull(),
  suggestions: jsonb('suggestions').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations - apenas para TypeScript types
// NÃO usar .query do Drizzle - queries escritas com SQL puro
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

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
```

---

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

---

## Configuração Drizzle Kit

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  casing: 'camel',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

> **Nota**: Com `casing: 'camel'`, o Drizzle converte automaticamente `createdAt` → `created_at` no banco. Não é necessário escrever os nomes das colunas duas vezes.

---

## Variáveis de Ambiente

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast123@localhost:5432/devroast
```

---

## Comandos

```bash
# Gerar migration
pnpm drizzle-kit generate

# Executar migration
pnpm drizzle-kit migrate

# Push schema (desenvolvimento)
pnpm drizzle-kit push

# Studio (interface gráfica)
pnpm drizzle-kit studio
```

---

## Seed (Dados Iniciais)

```typescript
// src/db/seed.ts
import { db } from './index';
import { users } from './schema';

async function seed() {
  await db.insert(users).values({ username: 'victorvhvhvh' });
  console.log('Seed completed!');
}

seed();
```

```bash
# Executar seed
pnpm tsx src/db/seed.ts
```

---

## Exemplo de Dados

### User
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "victorvhvhvh",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Submission
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "function calculate() { var x = 1; return x; }",
  "language": "javascript",
  "roast_mode": "roast",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Roast
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "submission_id": "660e8400-e29b-41d4-a716-446655440000",
  "verdict": "needs_serious_help",
  "roast_title": "this code looks like it was written during a power outage... in 2005.",
  "score": "3.5",
  "line_count": 7,
  "issues": [
    {
      "title": "Using var instead of const",
      "description": "The var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior.",
      "severity": "critical",
      "line_number": 1
    }
  ],
  "suggestions": [
    {
      "filename": "calculate.js",
      "diff": "..."
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```
