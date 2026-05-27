# Spec: Leaderboard Page with tRPC

## Resumo
Substituir os dados mockados da página `/leaderboard` por dados reais vindos do banco através de uma nova tRPC procedure, seguindo o design do ShameLeaderboard da homepage mas com listagem completa (20 entries) e full code via CodeBlock.

## Pesquisa realizada

| Abordagem | Prós | Contras | Veredito |
|---|---|---|---|
| **tRPC server caller (RSC)** | Zero JS client-side, direto | Sem loading/transição animada | ❌ Descartado |
| **tRPC + useQuery (cliente)** | Loading states animados, NumberFlow, padrão AGENTS.md | + bundle client-side | ✅ **Escolhido** |
| **DB query direta (RSC)** | Já usado na homepage | Foge do padrão tRPC que o usuário pediu | ❌ Descartado |

## Decisao

- Nova procedure `leaderboard.getTop` no tRPC
- `LeaderboardPage` vira Client Component com `useQuery`
- Métricas (totalSubmissions, avgScore) inclusas na mesma procedure
- Números usam `NumberFlow` para animação 0 → valor (conforme AGENTS.md)
- Esqueleto de loading para os 20 entries

```
src/trpc/routers/leaderboard.ts     ← nova router
  └── getTop(limit: 20)             ← procedure pública
       ├── entries[]                ← top 20 (ORDER BY score ASC)
       ├── totalSubmissions: number
       └── avgScore: string

src/app/leaderboard/page.tsx        ← Client Component
  ├── useQuery(trpc.leaderboard.getTop)
  ├── NumberFlow para métricas
  └── FlatList de entries com CodeBlock
```

## Especificacao de implementacao

### 1. `src/trpc/routers/leaderboard.ts` (nova)

```typescript
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
      // Query 1: leaderboard entries (JOIN submissions + roasts + users)
      // Query 2: aggregate metrics (count + avg)
      // Promise.all + return
    }),
});
```

### 2. `src/trpc/routers/_app.ts` (modificado)

Adicionar `leaderboard: leaderboardRouter` ao `appRouter`.

### 3. `src/app/leaderboard/page.tsx` (modificado)

- Adicionar `"use client"`
- Usar `useTRPC` from `@/trpc/client`
- `useQuery(trpc.leaderboard.getTop.queryOptions({ limit: 20 }))`
- States: loading (skeleton), error, data
- Loading skeleton similar ao `ShameLeaderboardSkeleton` mas 20 entries

### Tipos

```typescript
// Em leaderboard.ts
interface LeaderboardEntry {
  id: string; code: string; language: string; score: string;
  verdict: string; username: string; lineCount: number; createdAt: Date;
}
```

## Dependencias novas

Nenhuma. tRPC, React Query e NumberFlow já estão no projeto.

## Riscos e consideracoes

1. **Leaderboard page vira Client Component**: ganha interatividade (loading states animados) mas perde SSR puro. Aceitável pois a página já não tem SEO crítico.
2. **`getLeaderboard` em `queries.ts` retorna sem `lineCount`**: a query raw SQL precisa incluir `r.line_count` no SELECT. A `LeaderboardItem` interface também precisa ser atualizada.

## TODOs de implementacao

- [ ] Criar `src/trpc/routers/leaderboard.ts` com procedure `getTop`
- [ ] Adicionar `leaderboardRouter` ao `_app.ts`
- [ ] Atualizar `getLeaderboard`/`LeaderboardItem` em `queries.ts` para incluir `lineCount`
- [ ] Converter `page.tsx` para Client Component com `useQuery`
- [ ] Adicionar loading skeleton na leaderboard page
- [ ] Rodar lint e typecheck
