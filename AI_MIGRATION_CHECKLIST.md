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
| `span.font-bold` | `<ItemTitle className="text-base">` | `@/components/ui/item` |
| `span.text-[10px]` | `<ItemDescription className="text-xs">` | `@/components/ui/item` |
| `div.flex.flex-col` | `<ItemContent>` | Vertical stack de textos |
| `div.flex.justify-between` | `<ItemHeader>` / `<ItemFooter>` | Alinhamento horizontal de topo/base |
| `div.flex.items-center.gap-2` | `<ItemActions>` | Alinhamento de botões/ações |
| `div.icon-container` | `<ItemMedia variant="icon">` | Container de ícones |
| `styled-components` | `className="flex gap-2 ..."` | Tailwind CSS |
| `Modal` | `Dialog` | <Dialog > |
| `status="Success"` | `emerald-500` / `green-500` | `getChartColor(14)` (Emerald 400) |
| `status="Info"` | `blue-500` / `cyan-500` | `getChartColor(1)` (Blue 400) |
| `status="Warning"` | `amber-500` / `orange-500` | `getChartColor(10)` (Amber 400) |
| `status="Danger"` | `red-500` / `rose-500` | `getChartColor(8)` (Red 400) |

### 🎨 Cores do Sistema (Tailwind Default Colors)
*Utilizar classes padrão do Tailwind (ex: `text-blue-500`, `bg-emerald-600`)*

Sempre converta cores fixas ou status do legado para cores padrão do Tailwind:
- **Sucesso / Positivo**: `emerald` ou `green`.
- **Informativo / Neutro**: `blue` ou `cyan`.
- **Alerta / Atenção**: `amber` ou `orange`.
- **Crítico / Perigo**: `red` ou `rose`.
- **Especiais**: Utilize a paleta estendida (violet, pink, indigo, teal, lime, etc).
- **Gráficos Dinâmicos**: Use `getChartColor(index)` de `@/components/ui/chart` para obter cores automáticas.

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
    - Usar `<ItemTitle>`, `<ItemDescription>` para a tipagem de texto.
    - Adicionar Ações (Edit/Delete) em `<DropdownMenu>`.
- [ ] **Form**: Layout responsivo com Tailwind (ex: `grid-cols-1 md:grid-cols-2`).

### 4. Finalização
- [ ] **i18n**: Garantir uso de `t('')` e chaves em `locales/*.json`.
- [ ] **Limpeza**: Remover código morto e `console.log`.
- [ ] **Validação**: Testar fluxo completo (Listagem -> Detalhe -> Edição).
