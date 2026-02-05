# Project Rules

## Stack
- React + Vite + TanStack Router + TanStack Query + Zustand

## UI & Estilização
- Use ShadCN UI (`src/components/ui`)
- NUNCA use tags HTML puras estilizadas - use componentes ShadCN
- Para cores de gráficos: `getChartColor(index)` de `src/components/ui/chart`
- NUNCA use `mx-auto` no ChartContainer

## Internacionalização (CRÍTICO)
- TODA string de UI deve usar `t('chave')` do `react-i18next`
- SEMPRE adicionar chaves nos 3 arquivos: `pt.json`, `en.json`, `es.json` em `src/config/translations/`
- Use grep para verificar se a chave já existe antes de criar

## Roteamento
- Rotas baseadas em diretórios com `index.tsx` obrigatório
- PROIBIDO usar `.` para criar rotas aninhadas (ex: `edit.$id.tsx`)
- Estrutura válida: `index.tsx`, `add.tsx`, `$id.tsx`

## Datas
- SEMPRE usar `@/lib/formatDate` para formatação
- NUNCA importar `format` diretamente do `date-fns`

## Estado Global
- Usar Zustand com middleware `persist` para persistência
- NUNCA usar `localStorage.setItem` diretamente

## Componentes Obrigatórios
- Dados vazios: `<DefaultEmptyData />` de `src/components/default-empty-data.tsx`
- Loading: `<DefaultLoading />` de `src/components/default-loading.tsx`
- Formulários: `<DefaultFormLayout />` de `src/components/default-form-layout.tsx`

## Estrutura de Página
```tsx
<Card>
  <CardHeader title={t('titulo')}>
    {/* Ações: botões, filtros */}
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter layout="multi | single">
    {/* Paginação */}
  </CardFooter>
</Card>
```

## Componentes Comuns (não páginas)
- NUNCA usar Card.tsx em componentes comuns
- Usar `<Item>`, `<ItemTitle>`, `<ItemDescription>` de `src/components/ui/item.tsx`

## Hooks de API (Padrão TanStack Query)
```tsx
// src/hooks/use-{feature}-api.ts
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  detail: (id: string) => [...featureKeys.all, 'detail', id] as const,
};

export function useFeature() {
  return useQuery({
    queryKey: featureKeys.lists(),
    queryFn: async () => (await api.get('/feature/list')).data,
  });
}
```

## Hooks de Formulário (react-hook-form + zod)
- Criar em `@hooks/use-{feature}-form.ts` da rota
- Usar `zodResolver` para validação

## Antes de Criar Hooks
- VERIFICAR se já existe em `src/hooks/` (hooks globais)
- Hooks específicos de rota: criar em `@hooks/` da rota

## Estrutura de Pastas da Rota
```
src/routes/_private/{module}/
├── index.tsx           # Página principal
├── @components/        # Componentes específicos da rota
├── @consts/           # Valores fixos, enums
├── @hooks/            # Hooks específicos
├── @interface/        # Types, Interfaces, Schemas Zod
└── @utils/            # Funções auxiliares
```

## Selects Disponíveis (68 componentes em `src/components/selects`)
- Já encapsulam API, loading e erro
- Props: `mode`, `value`, `onChange`, `disabled`, `clearable`

**TOP 10 mais usados:**
| Componente | Usos |
|------------|------|
| `MachineByEnterpriseSelect` | 28 |
| `EnterpriseSelect` | 27 |
| `MachineSelect` | 9 |
| `UserSelect` | 8 |
| `UnitSelect` | 5 |
| `SensorByMachineSelect` | 5 |
| `MaintenancePlanSelect` | 4 |
| `CustomerSelect` | 4 |
| `ConsumptionMachineSelect` | 4 |
| `ModelMachineSelect` | 4 |

## Hooks Globais (258 hooks em `src/hooks`)

**TOP 15 mais usados:**
| Hook | Usos | Descrição |
|------|------|-----------|
| `useEnterpriseFilter` | 90 | idEnterprise do filtro global |
| `useHasPermission` | 35 | Verifica permissões do usuário |
| `useSidebar` | 7 | Estado da sidebar |
| `useSidebarToggle` | 7 | Toggle da sidebar |
| `useCMMSKPIs` | 6 | KPIs do CMMS |
| `useIsMobile` | 5 | Detecta dispositivo mobile |
| `useMachinesByEnterpriseSelect` | 5 | Máquinas por empresa (select) |
| `useEnterprisesSelect` | 4 | Empresas para select |
| `useUsersApi` | 4 | CRUD usuários |
| `usePartsApi` | 3 | CRUD peças |
| `useModelMachinesApi` | 3 | CRUD modelos de máquinas |
| `usePlatformsApi` | 3 | CRUD plataformas |
| `useAuth` | 3 | Sessão e login |
| `useSensorsApi` | 3 | CRUD sensores |
| `useMachinesApi` | 3 | CRUD máquinas |

## Antes de Commitar
```bash
pnpm run format  # Biome
pnpm run check   # TypeScript
```
