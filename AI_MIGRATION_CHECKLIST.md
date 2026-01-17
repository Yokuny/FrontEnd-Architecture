# 🤖 Checklist de Migração (Focado no Legacy)

Este checklist serve como guia prático para converter código do `iotlog-frontend` (Legado) para a nova arquitetura em `src/`.
**Referência Principal:** [ARCHITECTURE.md](./ARCHITECTURE.md) (Consulte para padrões de código).

---

## 1. 🔍 Análise do Módulo Legado

Antes de codar, mapeie os arquivos originais.
*Caminho base legado: `iotlog-frontend/src/`*

- [ ] **Rota**: Encontre a definição em `routes/routes.js`.
- [ ] **Página**: Localize o componente em `pages/{modulo}/{feature}/`.
- [ ] **Componentes**: Identifique imports de `components/Select/*` e `components/ListPaginated`.
- [ ] **Estado Global**: Verifique se usa `connect` (Redux) e quais reducers (`reducers/*.reducer.js`).

---

## 2. 🗺️ Tabela de Conversão (De -> Para)

### Estado & Lógica
| Legado (Redux/Actions) | Novo (React Query / Zustand) | Padrão |
|---|---|---|
| `Fetch.get/post` | `useQuery` / `useMutation` | `src/hooks/use-{feature}-api.ts` |
| `enterpriseFilter.action` | `useEnterpriseFilter` | `src/hooks/use-enterprise-filter.ts` |
| `fleet.action.js` | `useFleetManagerStore` / `useFleetApi` | Zustand (Stores) ou API Hooks |
| `map.actions.js` | `useMapStore` | Zustand |
| `auth.action` | `useAuth` | `src/hooks/use-auth.ts` |
| `Reducer / Redux` | `Zustand Store /  TanStack Query.` | Criar hook em `src/hooks/`ou TanStack Query no proprio arquivo |
| `localStorage` | `Zustand (persist)` | Middleware `persist` do Zustand |
| `window.location.search` | `useSearch` | Validado com Zod Schema |

### Selects do Sistema
*Localizados em `iotlog-frontend/src/components/Select/*` -> `src/components/selects/*`*

| Select Legado | Novo Componente | Hook Associado |
|---|---|---|
| `SelectEnterprise` | `EnterpriseSelect` | `useEnterprisesApi` |
| `SelectMachine` | `MachineSelect` | `useMachinesApi` |
| `SelectSensor` | `SensorSelect` | `useSensorsApi` |
| `SelectUsers` | `UserSelect` | `useUsersApi` |
| `SelectRole` | `RoleSelect` | `useRolesApi` |
| `SelectCustomer` | `CustomerSelect` | `useCustomersApi` |
| `SelectSupplier` | `SupplierSelect` | `useSuppliersApi` |
| `SelectFleet` | `FleetSelect` | `useFleetsApi` |
| `SelectPart` | `PartSelect` | `usePartsApi` |
| `SelectStatus` | `StatusSelect` | N/A (Estático) |
| `SelectCountry` | `CountrySelect` | N/A (Estático) |
| `SelectPriority` | `PrioritySelect` | N/A (Estático) |

### UI & Componentes Visuais
| Legado (`@paljs/ui`) | Novo (ShadCN/Tailwind) | Exemplo |
|---|---|---|
| `<Card>`/`<CardHeader>` | `<Card>`, `<CardHeader>` | `@/components/ui/card` |
| `<Input>` | `<Input>` | `@/components/ui/input` |
| `<Button status="Primary">` | `<Button variant="default">` | `@/components/ui/button` |
| `<Button status="Danger">` | `<Button variant="destructive">` | `@/components/ui/button` |
| `EvaIcon` (`flag`) | `Flag` (Lucide) | `import { Flag } from 'lucide-react'` |
| `ListPaginated` | `<Item>` + `<Pagination>` | Ver `src/components/ui/item.tsx` |
| `toastr.success` | `toast.success` | `sonner` |
| `styled-components` | `className="flex gap-2 ..."` | Tailwind CSS |
| `Modal` | `Dialog` | <Dialog > |

---

## 3. 🚀 Guia de Implementação (Passo a Passo)

### 1. Preparação da Rota
- [ ] Criar pasta: `src/routes/_private/{modulo}/{feature}/`
- [ ] Arquivo `index.tsx` com `createFileRoute`.
- [ ] Definir `validateSearch` com Zod (page, size, search, filters).

### 2. Migração de Dados (Hooks)
- [ ] **Substituir Redux**: Se o legado usa `connect(mapStateToProps)`, substitua por hooks (ex: `useEnterpriseFilter()`).
- [ ] **API**:
    - Verificar `src/hooks/` globais.
    - Se não existir, criar hook da API usando `useQuery` (GET) e `useMutation` (POST/PUT/DEL).
- [ ] **Formulário**: Migrar `useState` ou `redux-form` para `react-hook-form` + `zod`.

### 3. Construção da Interface
- [ ] **Shell**: Estrutura `Card > CardHeader > CardContent`.
- [ ] **Filtros**: Componentes de filtro atualizando a URL (`navigate({ search })`).
- [ ] **Lista**: Mapear dados para componente `<Item>`.
    - Usar `<ItemTitle>`, `<ItemDescription>`.
    - Adicionar Ações (Edit/Delete) em `<DropdownMenu>`.
- [ ] **Form**: Layout responsivo com Tailwind (ex: `grid-cols-1 md:grid-cols-2`).

### 4. Finalização
- [ ] **i18n**: Garantir uso de `t('')` e chaves em `locales/*.json`.
- [ ] **Limpeza**: Remover código morto e `console.log`.
- [ ] **Validação**: Testar fluxo completo (Listagem -> Detalhe -> Edição).
