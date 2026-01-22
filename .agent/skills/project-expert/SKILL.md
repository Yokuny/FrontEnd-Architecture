---
name: project-expert
description: Especialista na arquitetura do projeto FrontEnd-Architecture, guiando o desenvolvimento com regras estritas baseadas no ARCHITECTURE.md.
---

# Project Expert Skill

Este skill encapsula o conhecimento profundo da arquitetura do projeto `FrontEnd-Architecture`. Use-o para validar decisões técnicas, guiar implementações e garantir conformidade com os padrões estabelecidos.

## 🧠 Conhecimento Arquitetural (Building Blocks)

As seguintes regras são **INVIOLÁVEIS** e devem ser verificadas em todas as sugestões de código.

### 1. Tech Stack Core
- **Framework**: React + Vite
- **Router**: TanStack Router (File-based routing)
- **Data Fetching**: TanStack Query
- **State Management**: Zustand (com middleware `persist` para dados complexos). **PROIBIDO** usar `localStorage` diretamente.
- **UI Lib**: ShadCN UI

### 2. UI & Estilização (ShadCN)
- **Regra de Ouro**: NÃO estilizar tags HTML puras (ex: `<div className="...">`). Use os componentes do ShadCN (`Item`, `Card`, `Button`, `Input` etc.).
- **Gráficos**:
    - Use `getChartColor(index)` para cores.
    - NÃO use `mx-auto` no container.
    - Use `aspect-square` ou `max-h-[XXXpx]`.
- **Arquivos Modelo (NÃO IMPORTAR)**:
    - Estes arquivos são apenas templates. Copie o código, não faça importação:
    - `GraphArea`, `GraphBarStacked`, `GraphLines`, `GraphPizza`, `GraphProgress`, `GraphRadial`.
    - `DefaultNumbersRender`, `DefaultTable`.
- **Estados Visuais**:
    - **Loading**: Use `DefaultLoading` (`src/components/default-loading.tsx`).
    - **Vazio**: Use `default-empty-data.tsx` se `data.length === 0`.
    - **Formulários**: Use `DefaultFormLayout`.

### 3. Internacionalização (i18n)
- **Obrigatoriedade**: Toda chave de texto DEVE existir em TODOS os arquivos:
    - `src/config/translations/pt.json` (Default)
    - `src/config/translations/en.json`
    - `src/config/translations/es.json`
- **Validação**: Antes de sugerir código com `t('key')`, verifique se a chave existe. Se não, instrua a criação nos 3 arquivos.

### 4. Roteamento e Estrutura de Pastas
- **Padrão**: Baseado em diretórios.
- **Arquivos**: `index.tsx` (Lista), `add.tsx` (Criação), `$id.tsx` (Detalhe).
- **Restrição**: PROIBIDO usar `.` no nome de pastas para aninhamento (ex: `users.edit` ❌ -> `users/edit` ✅).
- **Search Params**: Use `validateSearch` com `zod` no `createFileRoute`.
- **Index**: Toda pasta de rota DEVE ter um `index.tsx`.
- **Estrutura Interna da Rota**:
    - `src/routes/_private/{feature}/`
        - `@components/`: Componentes locais.
        - `@hooks/`: Hooks locais (use-feature-form.ts).
        - `@interface/`: Zod schemas e TS types.
        - `@consts/`: Constants e enums.
        - `@utils/`: Utilitários locais.

### 5. Padrão de Página (Componentes)
Toda nova página DEVE seguir esta estrutura hierárquica:
1. **Wrapper**: `<Card>`
2. **Header**: `<CardHeader title={t('...')} ... >`
3. **Content**: `<CardContent>`
4. **Footer**: `<CardFooter>` (se necessário)

**Componentes Internos**:
- NÃO use componentes de `Card.tsx` dentro do conteúdo (apenas no wrapper principal).
- Use `Item.tsx` (`ItemTitle`, `ItemDescription`) para construção de componentes e tipagem.

### 6. Gerenciamento de Dados (Hooks & API)
- **Centralização**: Hooks de API devem ficar em `src/hooks/` se reutilizáveis.
- **Query Keys**: Devem ser objetos centralizados (ex: `usersKeys.all`, `usersKeys.list`).
- **Formulários**: `react-hook-form` + `zod` resolver.
- **Datas**: Use EXCLUSIVAMENTE `date-fns`. Formatos: `dd MM yy` ou `dd MM yyyy HH:mm`.

### 7. Seletores (Selects)
Use os componentes prontos em `src/components/selects` ao invés de criar `Select` do zero:
- `EnterpriseSelect` (Filtro global)
- `MachineByEnterpriseSelect`
- `SensorByEnterpriseSelect`
- `StatusSelect`, `ConditionSelect`, `CountrySelect`

## 🛠️ Modos de Operação

### Modo: Guiar Nova Feature
1. **Analise**: Onde a feature se encaixa na árvore de rotas?
2. **Verifique Hooks**: Já existe um hook em `src/hooks/` que atenda? (Verifique `use-machines-api`, `use-users-api`, etc.)
3. **Defina Estrutura**: Proponha a árvore de arquivos usando `@components`, `@hooks`, etc.
4. **Gere Código**: Comece pelo Schema Zod (`@interface`), depois o Hook (`@hooks`), e por fim a UI (`index.tsx`).

### Modo: Code Review / Refactor
Verifique agressivamente:
- [ ] Está usando `localStorage` puro? -> Mande usar Zustand persist.
- [ ] Criou `style={{...}}` ou classes arbitrárias? -> Mande usar ShadCN.
- [ ] Chave i18n faltando em `en.json`? -> Alerte erro crítico.
- [ ] Usou `momentjs` ou `Dayjs`? -> Mande trocar por `date-fns`.
- [ ] Rota com nome `edit.user`? -> Mande corrigir para `edit/user`.

## Exemplo de Resposta Esperada

"Para implementar a listagem de usuários, seguirei a arquitetura oficial:

1. **Rota**: `/users` (diretório `src/routes/_private/users/`)
2. **Hook**: Reutilizarei `useUsers` de `src/hooks/use-users-api.ts`.
3. **Componente**:
    - Wrapper: `Card` > `CardHeader`
    - Lista: `DefaultTable` (modelo) com `ItemTitle`.
4. **i18n**: Adicionarei chaves em `pt.json`, `en.json`, `es.json`."
