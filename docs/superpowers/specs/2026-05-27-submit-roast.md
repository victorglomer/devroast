# Spec: Submit Roast — Análise de Código com IA

## Resumo

Substituir o mock atual de análise de código pela integração com a API Google Gemini, permitindo que o usuário cole código e receba uma análise real feita por IA com suporte a dois modos: normal (construtivo) e roast (sarcástico).

## Decisão

**Abordagem A — tRPC mutation + Gemini com structured output.** Toda a lógica de IA roda no servidor. O prompt da Gemini usa `responseMimeType: "application/json"` com schema tipado para receber o resultado como JSON validado, sem necessidade de parsing de texto livre.

**Provedor de IA:** Google Gemini (modelo `gemini-2.5-flash`, free tier). O usuário já possui API key.

## Especificação de implementação

### Arquivos novos

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/gemini.ts` | Serviço que monta o payload e chama a Gemini API com structured output |
| `src/lib/prompts.ts` | Templates de prompt para modo normal e roast |
| `src/trpc/routers/roast.ts` | tRPC router com mutation `submit` |

### Arquivos modificados

| Arquivo | Descrição |
|---------|-----------|
| `src/trpc/routers/_app.ts` | Registrar `roastRouter` |
| `src/components/hero-section.tsx` | Trocar `fetch` por `trpc.roast.submit.useMutation()` |
| `src/app/results/[id]/page.tsx` | Buscar dados reais do banco via `getSubmissionWithRoast` |

### Fluxo

```
HeroSection (textarea + toggle)
  → useMutation trpc.roast.submit
    → findOrCreateUser (username fixo por enquanto)
    → createSubmission (INSERT submissions)
    → analyzeCode(code, roastMode) → Gemini API
    → createRoast (INSERT roasts com resultado da IA)
    → return { submissionId }
  → router.push(/results/{submissionId})

ResultsPage
  → getSubmissionWithRoast(submissionId)
  → render ScoreRing, issues grid, suggested fix
```

### Prompts

**Modo normal:** Prompt técnico e construtivo. Pede análise de bugs, anti-patterns, problemas de performance, segurança e legibilidade. Tom profissional.

**Modo roast:** Prompt sarcástico e brutalmente honesto. Pede para "humilhar" o código com humor, mas ainda apontar problemas reais. Tom engraçado e cruel.

### Structured output schema

```typescript
interface GeminiRoastResponse {
  verdict: string;
  roastTitle: string;
  score: number; // 0-10
  lineCount: number;
  issues: Array<{
    title: string;
    description: string;
    severity: "critical" | "warning" | "good";
    lineNumber: number | null;
  }>;
  suggestions: Array<{
    filename: string;
    diff: string;
  }>;
}
```

### Tratamento de erros

- Se a Gemini API falhar (rate limit, timeout, etc.): retornar erro 503 com mensagem amigável
- Validação de input no Zod (código vazio, linguagem inválida)
- O usuário já existente é fixo (`victorvhvhvh`) — sem cadastro por enquanto

## Dependências novas

| Pacote | Motivo | Bundle (server-only) |
|--------|--------|---------------------|
| `@google/generative-ai` | SDK oficial da Gemini API | ~30KB (server-only) |

## Riscos e considerações

1. **Rate limit da Gemini free tier:** Se muitos usuários usarem simultaneamente, pode haver throttling. Mitigação: monitorar e considerar cache de resultados idênticos.
2. **Custo se o projeto crescer:** O free tier tem limites diários. Se o projeto escalar, precisará migrar para plano pago (~$0.50/1M tokens no Gemini 3 Flash).
3. **Qualidade do roast varia:** O prompt precisa ser iterado para garantir resultados consistentes e engraçados. Mitigação: template bem escrito com exemplos (few-shot).
4. **API key exposta no server:** A chave fica apenas no servidor (`process.env`), nunca no client. Seguro.

## TODOs de implementação

- [ ] Instalar `@google/generative-ai`
- [ ] Adicionar `GEMINI_API_KEY` ao `.env.local`
- [ ] Criar `src/lib/prompts.ts` com templates normal e roast
- [ ] Criar `src/lib/gemini.ts` com serviço de análise
- [ ] Criar `src/trpc/routers/roast.ts` com mutation submit
- [ ] Registrar `roastRouter` em `_app.ts`
- [ ] Atualizar `hero-section.tsx` para usar tRPC mutation
- [ ] Atualizar `results/[id]/page.tsx` para buscar dados reais
- [ ] Verificar lint e build
