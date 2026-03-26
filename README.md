# DentalEase — Front-End

Sistema de gestão de clínica odontológica. Interface web moderna com foco em produtividade e consistência visual.

## Stack

| Tecnologia | Propósito | Versão |
|------------|-----------|--------|
| React | Biblioteca UI | 19 |
| Vite | Bundler e dev server | 7 |
| TypeScript | Tipagem estática | 5 |
| TanStack Router | Roteamento file-based | 1 |
| TanStack Query | Server state (cache, loading, refetch) | 5 |
| Zustand | Client state (persist middleware) | 5 |
| ShadCN UI + Radix | Biblioteca de componentes | latest |
| Tailwind CSS | Estilização | 4 |
| react-hook-form + Zod | Formulários e validação | 7 / 3 |
| Recharts | Gráficos | 2 |
| Biome | Linting e formatação | 2 |

## Monorepo

```
NEW-ARCH/
├── FrontEnd-Architecture/           # Este projeto (React SPA)
└── DentalEase/
    └── DentalEase-BackEnd/          # API REST (Node.js + Express + MongoDB)
```

## Estrutura do Projeto

```
src/
├── routes/                          # Páginas (TanStack Router file-based)
│   ├── __root.tsx                   # Layout raiz
│   ├── _private/                    # Rotas autenticadas
│   │   ├── patient/                 # Gestão de pacientes
│   │   ├── schedule/                # Agendamentos
│   │   ├── financial/               # Financeiro
│   │   ├── odontogram/              # Odontogramas
│   │   ├── reminders/               # Lembretes
│   │   └── settings/                # Configurações (perfil, clínica, procedimentos)
│   └── _public/                     # Rotas públicas
│       ├── auth/                    # Login, signup, recovery
│       └── schedule/                # Agendamento público
├── components/
│   ├── ui/                          # ShadCN UI (56 componentes)
│   ├── data-inputs/                 # Comboboxes e selects globais (8)
│   ├── icons/                       # Ícones SVG customizados (94)
│   ├── odontogram/                  # Visualização odontograma
│   ├── graph-*.tsx                  # Modelos de gráficos (referência)
│   ├── default-loading.tsx          # Skeleton de loading
│   ├── default-empty-data.tsx       # Estado vazio
│   └── default-form-layout.tsx      # Layout de formulários
├── hooks/                           # Hooks globais (auth, stores, utilitários)
├── query/                           # TanStack Query hooks por feature
├── lib/
│   ├── api/client.ts                # Fetch wrapper com auth automático
│   ├── helpers/                     # Utilitários (translate, formatDate, formatters)
│   └── interfaces/                  # TypeScript interfaces globais
├── config/
│   └── translations.json            # Traduções pt-BR
└── styles.css                       # Estilos globais
```

### Estrutura de Cada Módulo/Rota

```
src/routes/_private/{module}/
├── index.tsx                        # Página principal (listagem)
├── add/index.tsx                    # Formulário criar/editar
├── details.tsx                      # Detalhe (ID via search params)
├── @components/                     # Componentes específicos
├── @consts/                         # Valores fixos, enums
├── @hooks/                          # Hooks específicos (form, api)
├── @interface/                      # Types, Interfaces, Schemas Zod
└── @utils/                          # Funções auxiliares
```

## Getting Started

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Type-checking
pnpm check

# Formatação (Biome)
pnpm format

# Lint (Biome)
pnpm lint

# Build para produção
pnpm build
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção (`vite build && tsc --noEmit`) |
| `pnpm check` | Type-checking TypeScript |
| `pnpm format` | Formatação com Biome |
| `pnpm lint` | Lint com Biome |
| `pnpm routes` | Extrair rotas do projeto |

## Workflow de Desenvolvimento

### Criar Nova Feature

1. Criar pasta em `src/routes/_private/{feature}/`
2. Criar `index.tsx` com `createFileRoute` + `staticData`
3. Criar subpastas: `@components/`, `@hooks/`, `@interface/`, `@consts/`, `@utils/`
4. Seguir padrão: `Card asPage > CardHeader > CardContent > CardFooter`
5. Verificar hooks existentes em `src/hooks/` e `src/query/` antes de criar novos
6. Usar `DefaultLoading`, `DefaultEmptyData`, `DefaultFormLayout`

Consulte [`docs/checklist.md`](./docs/checklist.md) para a checklist completa.

### API

- Queries centralizadas em `src/query/{feature}.ts`
- Fetch via `request()` + `GET()`/`POST()` de `@/lib/api/client`
- TanStack Query gerencia cache — mutations invalidam queries automaticamente

### Formulários

- Schema Zod em `@interface/{feature}.interface.ts`
- Hook em `@hooks/use-{feature}-form.ts` com `zodResolver`
- Componente em `@components/{feature}-form.tsx` com `useFormContext` + `DefaultFormLayout`

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [`CLAUDE.md`](./CLAUDE.md) | Regras rápidas do projeto (para IA) |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Padrões detalhados com exemplos |
| [`docs/page-patterns.md`](./docs/page-patterns.md) | Padrões de página (listagem e formulário) |
| [`docs/api-hooks.md`](./docs/api-hooks.md) | Padrão TanStack Query |
| [`docs/form-hooks.md`](./docs/form-hooks.md) | Padrão react-hook-form + Zod |
| [`docs/schemas-types.md`](./docs/schemas-types.md) | Interfaces, schemas, consts |
| [`docs/state-management.md`](./docs/state-management.md) | Zustand + persist |
| [`docs/react-patterns.md`](./docs/react-patterns.md) | Padrões de componentes React |
| [`docs/route-structure.md`](./docs/route-structure.md) | Estrutura de rotas e pastas |
| [`docs/charts.md`](./docs/charts.md) | Gráficos Recharts |
| [`docs/available-resources.md`](./docs/available-resources.md) | Hooks, componentes e helpers disponíveis |
| [`docs/backend-reference.md`](./docs/backend-reference.md) | Referência do back-end |
| [`docs/stack.md`](./docs/stack.md) | Tech stack e versões |
| [`docs/checklist.md`](./docs/checklist.md) | Checklist de nova feature |

## VSCode Extensions Recomendadas

- **Tailwind CSS IntelliSense** — Autocomplete de classes Tailwind
- **Biome** — Formatação e linting
