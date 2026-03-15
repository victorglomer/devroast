# Devroast - AGENTS

## Design Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-page` | `#0A0A0A` | Fundo da página |
| `--bg-surface` | `#0F0F0F` | Superfícies elevadas |
| `--bg-input` | `#111111` | Inputs, código |
| `--border-primary` | `#2A2A2A` | Bordas |
| `--text-primary` | `#FAFAFA` | Texto principal |
| `--text-secondary` | `#6B7280` | Texto secundário |
| `--accent-green` | `#10B981` | Primary action |
| `--accent-amber` | `#F59E0B` | Warning |
| `--accent-red` | `#EF4444` | Error |

## Bibliotecas

- `@base-ui/react` — Componentes interativos (Toggle)
- `shiki` — Syntax highlighting (CodeBlock server component)
- `class-variance-authority` — Variantes de componentes
- `tailwind-merge` + `clsx` — Merge de classes

## Componentes (`src/components/ui/`)

- **Button** — cva com variantes: default, destructive, outline, secondary, ghost, link
- **Toggle** — base-ui Switch (client)
- **Badge** — visual: critical, warning, good, verdict
- **CodeBlock** — Shiki server component (tema vesper)
- **Card** — cva padding: default, sm, lg, none
- **ScoreRing** — SVG progress circular
- **Navbar** — logo + link

## Regras

- Named exports sempre
- Estender atributos HTML nativos com TypeScript
- Usar cva + cn para variantes
- Componentes pequenos e focados
- CodeBlock como server component
