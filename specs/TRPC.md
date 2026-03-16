# Devroast - tRPC Implementation Spec

## Visão Geral

Integrar tRPC como camada de API/backend para fornecer end-to-end type-safety entre servidor e cliente.

## Dependências

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query superjson server-only zod
```

| Pacote | Versão | Função |
|--------|--------|--------|
| `@trpc/server` | ^11 | Servidor tRPC |
| `@trpc/client` | ^11 | Cliente tRPC |
| `@trpc/react-query` | ^11 | Integração React Query |
| `@tanstack/react-query` | ^5 | Cache e estado (peer dependency) |
| `superjson` | ^7 | Serialização de dados |
| `server-only` | ^0.1 | Proteção de código server-only |
| `zod` | ^3 | Validação de input |

## Estrutura de Arquivos

```
src/
├── trpc/
│   ├── client.ts           # Cliente tRPC para Server Components
│   ├── query-client.ts    # QueryClient factory
│   ├── server.ts          # Server-side caller
│   ├── init.ts            # Inicialização tRPC (context, procedures)
│   └── routers/
│       ├── _app.ts        # Root router
│       ├── roast.ts       # Router de roasts
│       └── leaderboard.ts # Router de leaderboard
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts # Next.js API Route handler
│   └── layout.tsx         # Providers (QueryClientProvider)
```

## Configuração

### 1. Query Client (`src/trpc/query-client.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';
import { makeQueryClient } from '@trpc/react-query/shared';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
      },
    },
  });
}
```

### 2. Inicialização tRPC (`src/trpc/init.ts`)

```typescript
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@/db';

export async function createTRPCContext() {
  return {
    db,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const createCallerFactory = t.createCallerFactory;
```

### 3. Routers (`src/trpc/routers/`)

#### Root Router (`src/trpc/routers/_app.ts`)

```typescript
import { router } from '../init';
import { roastRouter } from './roast';
import { leaderboardRouter } from './leaderboard';

export const appRouter = router({
  roast: roastRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
```

#### Roast Router (`src/trpc/routers/roast.ts`)

```typescript
import { router, publicProcedure } from '../init';
import { z } from 'zod';

export const roastRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Implementar query com drizzle
      return null;
    }),

  create: publicProcedure
    .input(z.object({
      code: z.string(),
      language: z.string(),
      roastMode: z.enum(['normal', 'roast']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Implementar mutation
      return { id: 'mock-id' };
    }),
});
```

#### Leaderboard Router (`src/trpc/routers/leaderboard.ts`)

```typescript
import { router, publicProcedure } from '../init';

export const leaderboardRouter = router({
  getTop: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      // Implementar query
      return [];
    }),
});
```

### 4. API Route (`src/app/api/trpc/[trpc]/route.ts`)

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 5. Server-Side Caller (`src/trpc/server.ts`)

```typescript
import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);
const createCaller = createCallerFactory(appRouter);

export const serverCaller = createCaller(createTRPCContext());

export const { trpc, HydrateClient } = createHydrationHelpers(
  serverCaller,
  getQueryClient,
);
```

### 6. Providers no Layout (`src/app/layout.tsx`)

```typescript
'use client';

import { QueryClientProvider } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';
import { getQueryClient } from '@/trpc/query-client';
import { type AppRouter } from '@/trpc/routers/_app';
import { trpc as trpcClient } from '@/trpc/client';
import { RootLayout } from './root-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpcClient.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpcClient.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayout>{children}</RootLayout>
      </QueryClientProvider>
    </trpcClient.Provider>
  );
}
```

### 7. tRPC Client (`src/trpc/client.ts`)

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

## Uso em Server Components

### Chamada direta (sem cache)

```typescript
import { serverCaller } from '@/trpc/server';

export default async function Page() {
  const data = await serverCaller.roast.getById({ id: '123' });
  return <div>{data}</div>;
}
```

### Com Hydrate (com cache)

```typescript
import { trpc, HydrateClient } from '@/trpc/server';

export default async function Page() {
  void trpc.leaderboard.getTop.prefetch({ limit: 10 });

  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}

function ClientComponent() {
  const { data } = trpc.leaderboard.getTop.useQuery({ limit: 10 });
  return <div>{data}</div>;
}
```

## Uso em Client Components

```typescript
'use client';

import { trpc } from '@/trpc/client';

export function ClientComponent() {
  const { data, isLoading } = trpc.roast.getById.useQuery({ id: '123' });
  
  const mutation = trpc.roast.create.useMutation();
  
  return <div>{data}</div>;
}
```

## Regras

1. **Sempre usar zod** para validação de inputs em procedures
2. **Criar routers separados** por domínio (roast, leaderboard)
3. **Server-only**: Arquivos que só rodam no servidor devem ter `import 'server-only'`
4. **Superjson**: Usar transformer para serialização de dates e objetos complexos
5. **Named exports** para todos os routers e procedures
6. **Tipagem completa**: Sempre usar type inference do tRPC
7. **Prefetch em Server Components**: Usar `.prefetch()` para SSR com cache
