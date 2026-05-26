# Spec: Shame Leaderboard

## Resumo
Refatorar o leaderboard da homepage para um Server Component assíncrono com Suspense API, trazendo os 3 piores roasts (menores scores) e as métricas (total de roasts, score médio) no footer.

## Pesquisa realizada

| Abordagem | Prós | Contras | Veredito |
|---|---|---|---|
| **REST API + useEffect** (atual) | Simples | Sem SSR, sem Suspense, waterfall client/server | ❌ Descartado |
| **tRPC caller no server** | Reusa rota existente | Dependência do tRPC, mais boilerplate | ❌ Descartado |
| **DB query direta no Server Component** | Zero overhead, tipado, sem dependência extra | Acoplamento com DB (aceitável em RSC) | ✅ **Escolhido** |

## Decisao

- `ShameLeaderboard` será um **Async Server Component** que chama `getLeaderboard(3)` e `db.select` diretamente
- `page.tsx` vira **Server Component**; a parte interativa (formulário) é extraída para `HeroSection` (Client Component)
- `<Suspense fallback={<ShameLeaderboardSkeleton />}>` envolve o leaderboard
- Métricas (`totalRoasts`, `avgScore`) movidas para o footer da tabela do leaderboard

```
page.tsx (Server)
├── <HeroSection />            ← Client: textarea, toggle, submit
└── <Suspense fallback={Skeleton}>
    └── <ShameLeaderboard />    ← Async Server: DB direct
        ├── getLeaderboard(3)   ← 3 piores (ORDER BY score ASC)
        ├── count(*) + avg(*)   ← métricas
        └── tabela + footer com métricas
```

## Especificacao de implementacao

### Novos arquivos

1. **`src/components/shame-leaderboard-skeleton.tsx`**
   - Sem `"use client"` (Server Component puro)
   - 3 linhas de placeholder com `animate-pulse`
   - Estrutura idêntica à tabela real (header + linhas + footer)

2. **`src/components/shame-leaderboard.tsx`**
   - Async Server Component
   - `Promise.all([getLeaderboard(3), db.select(...)])` para paralelismo
   - Estados: empty (0 resultados), dados (1-3 resultados)
   - Footer exibe `totalRoasts` e `avgScore/10`

3. **`src/components/hero-section.tsx`**
   - Client Component (`"use client"`)
   - Extraído do `page.tsx` atual: state `code`, `roastMode`, `loading`
   - `handleSubmit` → POST `/api/roast` → redirect `/results/{id}`

### Arquivo modificado

4. **`src/app/page.tsx`**
   - Remove `"use client"`
   - Remove imports: `useRouter`, `useEffect`, `useState`, `MetricsSection`, `Button`, `Toggle`
   - Importa `Suspense` + `HeroSection` + `ShameLeaderboard` + `ShameLeaderboardSkeleton`

### Tipos

```typescript
// Reutilizado de queries.ts (não exportado, usado internamente)
interface LeaderboardItem {
  id: string;
  code: string;
  language: string;
  score: string;
  verdict: string;
  username: string;
  createdAt: Date;
}
```

## Dependencias novas

Nenhuma.

## Riscos e consideracoes

1. **Server Component + DB direto**: `getLeaderboard` usa `db.execute` com SQL raw — funciona em RSC porque roda no servidor. Risco baixo.
2. **`MetricsSection` existente**: não é removido, apenas deixa de ser usado na homepage. Pode ser reutilizado em outras páginas. Risco baixo.
3. **Layout shift com Suspense**: o skeleton tem a mesma estrutura da tabela real, então não deve haver layout shift quando os dados carregarem.

## TODOs de implementacao

- [x] Escrever spec
- [ ] Criar `src/components/shame-leaderboard-skeleton.tsx`
- [ ] Criar `src/components/shame-leaderboard.tsx`
- [ ] Criar `src/components/hero-section.tsx`
- [ ] Refatorar `src/app/page.tsx`
- [ ] Rodar lint e typecheck
