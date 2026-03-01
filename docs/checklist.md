# Checklist de Nova Feature

## 1. Estrutura de Pastas

- [ ] Criar pasta em `src/routes/_private/{feature}/`
- [ ] Criar `index.tsx` (listagem)
- [ ] Criar `add.tsx` (formulario)
- [ ] Criar `@interface/{feature}.interface.ts`
- [ ] Criar `@hooks/use-{feature}-form.ts`
- [ ] Criar `@components/{feature}-form.tsx` (se necessario)
- [ ] Criar `@consts/{feature}.consts.ts` (se necessario)

## 2. Query de API

- [ ] Verificar se ja existe em `src/query/`
- [ ] Se nao, criar em `src/query/{feature}.ts` seguindo `src/query/PATTERN.md`

## 3. Validacoes

- [ ] Datas com `@/lib/formatDate`
- [ ] Estado persistente com Zustand (nao localStorage)
- [ ] Usando `DefaultLoading` e `DefaultEmptyData`
- [ ] **Listagem usa `DataTable`** de `@/components/ui/data-table` — NUNCA `ItemGroup`/`Item`
- [ ] Colunas do `DataTable` declaradas com `useMemo<DataTableColumn<TEntity>[]>`
- [ ] `DataTable` com `searchable={false}` e `showPagination={false}` quando paginacao e busca sao controladas pela URL

## 4. Antes de Commitar

```bash
pnpm run format  # Biome
pnpm run check   # TypeScript
```
