# Tech Stack

| Categoria | Tecnologia | Versao |
|-----------|------------|--------|
| Runtime | Node.js | >=24 |
| Framework | React | 19 |
| Bundler | Vite | 7 |
| Router | TanStack Router | 1.x |
| Data Fetching | TanStack Query | 5.x |
| State | Zustand | 5.x |
| UI Library | ShadCN UI + Radix | - |
| Styling | TailwindCSS | 4.x |
| Forms | react-hook-form + zod | 7.x / 3.x |
| Linter/Formatter | Biome | 2.x |
| Charts | Recharts + ECharts | 2.x / 6.x |

## Arquitetura

```
React 19 + TypeScript
├── Routing      → TanStack Router (file-based)
├── Server State → TanStack Query
├── Client State → Zustand (persist)
├── Forms        → react-hook-form + zod
├── UI           → ShadCN + Radix
└── Styling      → TailwindCSS 4
```
