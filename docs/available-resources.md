# Recursos Disponiveis no Projeto

## Componentes de Select (68 em `src/components/selects/`)

Usar os componentes prontos ao inves de criar Select do zero. Ja encapsulam API, loading e erro.

```tsx
import { EnterpriseSelect, MachineByEnterpriseSelect, UserSelect } from '@/components/selects';

// Single select
<EnterpriseSelect mode="single" value={idEnterprise} onChange={setIdEnterprise} />

// Multi select
<MachineByEnterpriseSelect
  mode="multi"
  idEnterprise={idEnterprise}
  value={selectedMachines}
  onChange={setSelectedMachines}
/>
```

**Props padrao:** `mode`, `value`, `onChange`, `disabled?`, `clearable?`, `label?`, `placeholder?`

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

## Hooks Globais (258 em `src/hooks/`)

**TOP 15 mais usados:**

| Hook | Usos | Descricao |
|------|------|-----------|
| `useEnterpriseFilter` | 90 | idEnterprise do filtro global |
| `useHasPermission` | 35 | Verifica permissoes do usuario |
| `useSidebar` | 7 | Estado da sidebar |
| `useSidebarToggle` | 7 | Toggle da sidebar |
| `useCMMSKPIs` | 6 | KPIs do CMMS |
| `useIsMobile` | 5 | Detecta dispositivo mobile |
| `useMachinesByEnterpriseSelect` | 5 | Maquinas por empresa |
| `useEnterprisesSelect` | 4 | Empresas para select |
| `useUsersApi` | 4 | CRUD usuarios |
| `usePartsApi` | 3 | CRUD pecas |
| `useModelMachinesApi` | 3 | CRUD modelos |
| `usePlatformsApi` | 3 | CRUD plataformas |
| `useAuth` | 3 | Sessao e login |
| `useSensorsApi` | 3 | CRUD sensores |
| `useMachinesApi` | 3 | CRUD maquinas |

**ANTES de criar um hook**, verifique se ja existe em `src/hooks/`!

## Componentes Obrigatorios

| Componente | Import | Uso |
|------------|--------|-----|
| `DefaultEmptyData` | `@/components/default-empty-data` | Dados vazios |
| `DefaultLoading` | `@/components/default-loading` | Loading |
| `DefaultFormLayout` | `@/components/default-form-layout` | Layout de formularios |

## Componentes de UI

- **Paginas**: Usar `Card`, `CardHeader`, `CardContent`, `CardFooter`
- **Componentes comuns**: NUNCA Card. Usar `Item`, `ItemTitle`, `ItemDescription` de `@/components/ui/item`
- **Charts**: `getChartColor(index)` de `src/components/ui/chart`. NUNCA `mx-auto` no ChartContainer
