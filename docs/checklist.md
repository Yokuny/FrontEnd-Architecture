# Checklist de Nova Feature

## 1. Estrutura de Pastas

- [ ] Criar pasta em `src/routes/_private/{feature}/`
- [ ] Criar `index.tsx` (listagem)
- [ ] Criar `add.tsx` (formulario)
- [ ] Criar `@interface/{feature}.interface.ts`
- [ ] Criar `@hooks/use-{feature}-form.ts`
- [ ] Criar `@components/{feature}-form.tsx` (se necessario)
- [ ] Criar `@consts/{feature}.consts.ts` (se necessario)

## 2. Hook de API

- [ ] Verificar se ja existe em `src/hooks/`
- [ ] Se nao, criar em `src/hooks/use-{feature}-api.ts`

## 3. Validacoes

- [ ] Datas com `@/lib/formatDate`
- [ ] Estado persistente com Zustand (nao localStorage)
- [ ] Usando `DefaultLoading` e `DefaultEmptyData`

## 4. Antes de Commitar

```bash
pnpm run format  # Biome
pnpm run check   # TypeScript
```
