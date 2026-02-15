# src/hooks — Catalogo de Hooks Globais

> **ANTES de criar um novo hook**, verifique se o que voce precisa ja existe aqui.
> Para o padrao completo de implementacao, consulte [`docs/api-hooks.md`](../../docs/api-hooks.md).

---

## Estado Global (Zustand + persist)

| Hook | Arquivo | Proposito |
|------|---------|-----------|
| `useAuth` | `use-auth.ts` | Token JWT, usuario decodificado, tipo de login (`normal`/`sso`), estado de conta bloqueada, remember email |
| `useEnterpriseFilter` | `use-enterprise-filter.ts` | Empresa selecionada globalmente — `idEnterprise` usado por todos os hooks de API |
| `usePermissions` | `use-permissions.ts` | Cache de permissoes do usuario com `hasPermission(path)`, `useHasPermissions(paths[])`, `useRequirePermission(path)` |
| `useFavorites` | `use-favorites.ts` | Links favoritos: `toggleFavorite`, `isFavorite` |
| `useSidebar` | `use-sidebar-toggle.ts` | Estado do sidebar (expandido/colapsado), suporte mobile e hover |
| `useIsMobile` | `use-mobile.ts` | Detecta viewport mobile (`boolean`) |
| `useLocale` | `use-locale.ts` | Locale atual para formatacao de datas e numeros |

---

## Autenticacao

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Auth mutations | `use-auth-api.ts` | `useLogin`, `useLoginSSO`, `useRegister`, `useVerifyEmail`, `useRequestPasswordReset`, `useResetPassword`, `useSendUnlockCode`, `useVerifyUnlockCode` |

---

## Hooks de API (TanStack Query)

### Ativos / Maquinas

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Maquinas | `use-machines-api.ts` | `useMachines`, `useMachinesByEnterprise`, `useMachine`, `useMachinesApi`, `useMachinesSelect`, `useMachinesByEnterpriseSelect`, `mapMachinesToOptions`, `mapMachinesToOptionsSimple` |
| Modelos de Maquina | `use-model-machines-api.ts` | `useModelMachines`, `useModelMachinesSelect`, `mapModelMachinesToOptions` |
| Balizas (Buoys) | `use-buoys-api.ts` | `useBuoys`, `useBuoy`, `useBuoysApi`, `useBuoysSelect`, `mapBuoysToOptions` |
| Plataformas | `use-platforms-api.ts` | `usePlatforms`, `usePlatformsSelect`, `mapPlatformsToOptions` |
| Gestores de Maquina | `use-machine-managers-api.ts` | `useMachineManagers`, `useMachineManagersSelect` |

### Manutencao (CMMS)

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Planos de Manutencao | `use-maintenance-plans-api.ts` | `useMaintenancePlans`, `useMaintenancePlan`, `useMaintenancePlansApi` |
| Planos por Maquina | `use-maintenance-plans-by-machine-api.ts` | `useMaintenancePlansByMachine` |
| Tipos de Manutencao | `use-maintenance-types-api.ts` | `useMaintenanceTypes`, `useMaintenanceTypesSelect`, `mapMaintenanceTypesToOptions` |
| Pecas | `use-parts-api.ts` | `useParts`, `usePart`, `usePartsApi`, `usePartsSelect`, `mapPartsToOptions` |
| Equipamentos CMMS | `use-cmms-equipment-api.ts` | `useCmmsEquipment`, `useCmmsEquipmentApi` |
| RVE CMMS | `use-cmms-rve-api.ts` | `useCmmsRve`, `useCmmsRveApi` |

### FAS (Folio de Atividade de Servico)

| Hook | Arquivo | Exporta |
|------|---------|---------|
| FAS principal | `use-fas-api.ts` | `useFasPaginated`, `useFasDetails`, `useFasOrder`, `useConfirmFasOrder`, `useRequestFasOrder`, `useTransferOrder`, `useCancelOrder`, `useConfirmBMS`, `useRefuseBMS`, `useConfirmPayment`, `useConfirmContract`, `useAddOrderAttachment`, `useDeleteOrderAttachment`, `useExportFas`, `useFasInvoice`, `useFasPresignedUrl` + mais |
| Fornecedores FAS | `use-fas-planners-api.ts` | `useFasPlanners`, `useFasPlannersApi` |
| Analytics FAS | `use-fas-analytics-api.ts` | `useFasAnalytics` |

### Sensores e Telemetria

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Sensores | `use-sensors-api.ts` | `useSensors`, `useSensor`, `useSensorsApi`, `useSensorsSelect`, `mapSensorsToOptions` |
| Sensores por Ativo | `use-sensors-by-assets-api.ts` | `useSensorsByAssets` |
| Sinais de Sensor | `use-sensor-signals-api.ts` | `useSensorSignals`, `useSensorSignalsSelect` |
| Funcoes de Sensor | `use-sensor-functions-api.ts` | `useSensorFunctions`, `useSensorFunctionsSelect` |
| Telemetria | `use-telemetry-api.ts` | `useTelemetry`, `useTelemetryApi` |
| Parametros | `use-params-api.ts` | `useParams`, `useParamsApi` |

### Frota e Rastreamento

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Frotas | `use-fleets-api.ts` | `useFleets`, `useFleet`, `useFleetsApi`, `useFleetsSelect`, `mapFleetsToOptions` |
| Embarcacoes da Frota | `use-fleet-vessels-api.ts` | `useFleetVessels`, `useFleetVesselsApi` |
| Cercas | `use-fences-api.ts` | `useFences`, `useFence`, `useFencesApi` |
| Geofences | `use-geofences-api.ts` | `useGeofences`, `useGeofence`, `useGeofencesApi` |
| Atividade de Rastreamento | `use-tracking-activity-api.ts` | `useTrackingActivity` |
| Portos | `use-ports-api.ts` | `usePorts`, `usePortsSelect`, `mapPortsToOptions` |
| Escalas | `use-scales-api.ts` | `useScales`, `useScalesApi` |

### Contratos e Consumo

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Contratos | `use-contracts-api.ts` | `useContractsPaginated`, `useContract`, `useContractsApi` |
| Ativos de Contrato | `use-contract-assets-api.ts` | `useContractAssets`, `useContractAssetsSelect` |
| Grupos de Consumo | `use-consumption-groups-api.ts` | `useConsumptionGroups`, `useConsumptionGroupsSelect`, `mapConsumptionGroupsToOptions` |
| Maquinas de Consumo | `use-consumption-machines-api.ts` | `useConsumptionMachines` |
| Tipos de Combustivel | `use-fuel-types-api.ts` | `useFuelTypes`, `useFuelTypesSelect`, `mapFuelTypesToOptions` |
| PTAX | `use-ptax-api.ts` | `usePtax` |

### Usuarios e Permissoes

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Usuarios | `use-users-api.ts` | `useUsers`, `useUsersByEnterprise`, `useUser`, `useUserPermission`, `useUsersApi` |
| Select de Usuarios | `use-users-select-api.ts` | `useUsersSelect`, `mapUsersToOptions` |
| Usuarios nao em papel | `use-users-not-in-role.ts` | `useUsersNotInRole` |
| Papeis (Roles) | `use-roles-api.ts` | `useRoles`, `useRolesAll`, `useRole`, `useRolePaths`, `useChatbotPermissions`, `useRoleUsers`, `useRolesApi`, `useRolesSelect`, `mapRolesToOptions` |
| Permissoes API | `use-permissions-api.ts` | `usePermissionsApi` |
| Tipos de Usuario | `use-user-types-api.ts` | `useUserTypes`, `useUserTypesSelect`, `mapUserTypesToOptions` |
| Usuarios por mesmo nivel | `use-user-same-permission-api.ts` | `useUserSamePermission` |
| Times de Usuario | `use-user-team-api.ts` | `useUserTeam`, `useUserTeamApi` |
| Codigo de Integracao | `use-user-code-integration-api.ts` | `useUserCodeIntegration` |
| Empresas do Usuario | `use-user-enterprises-api.ts` | `useUserEnterprises` |

### Empresas e Clientes

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Empresas | `use-enterprises-api.ts` | `useEnterprises`, `useEnterprise`, `useEnterprisesApi`, `useEnterprisesSelect`, `mapEnterprisesToOptions` |
| Clientes | `use-customers-api.ts` | `useCustomers`, `useCustomer`, `useCustomersApi`, `useCustomersSelect`, `mapCustomersToOptions` |
| Fornecedores | `use-suppliers-api.ts` | `useSuppliers`, `useSupplier`, `useSuppliersApi`, `useSuppliersSelect`, `mapSuppliersToOptions` |
| Grupos | `use-groups-api.ts` | `useGroups`, `useGroupsSelect`, `mapGroupsToOptions` |
| Idiomas | `use-languages-api.ts` | `useLanguages`, `useLanguagesSelect`, `mapLanguagesToOptions` |

### Relatorios e Analytics

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Dashboards | `use-dashboards-api.ts` | `useDashboards`, `useDashboard`, `useDashboardsApi` |
| Estatisticas | `use-statistics-api.ts` | `useStatistics` |
| ESG | `use-esg-api.ts` | `useEsg`, `useEsgApi` |
| Metas | `use-goals-api.ts` | `useGoals`, `useGoal`, `useGoalsApi` |
| QLP | `use-qlp-api.ts` | `useQlp`, `useQlpApi` |
| Alertas | `use-alerts-api.ts` | `useAlerts`, `useAlert`, `useAlertsApi` |
| Tipos de Alerta | `use-alert-types-api.ts` | `useAlertTypes`, `useAlertTypesSelect`, `mapAlertTypesToOptions` |
| Tipos de Problema | `use-type-problems-api.ts` | `useTypeProblems`, `useTypeProblemsSelect`, `mapTypeProblemsTOptions` |

### Outros

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Formularios | `use-forms-api.ts` | `useForms`, `useForm`, `useFormsApi` |
| Status | `use-status-api.ts` | `useStatus`, `useStatusSelect`, `mapStatusToOptions` |
| Especialidades | `use-specialized-api.ts` | `useSpecialized`, `useSpecializedSelect` |
| IA | `use-ai-api.ts` | `useAiApi` e hooks de IA generativa |

---

## Como Usar

### Query simples

```tsx
import { useMachines } from '@/hooks/use-machines-api';

function MyComponent() {
  const { data, isLoading } = useMachines({ idEnterprise });
  // data.data: Machine[]
  // data.totalCount: number
}
```

### Select em formulario

```tsx
import { useMachinesSelect, mapMachinesToOptions } from '@/hooks/use-machines-api';

function MyForm() {
  const { data: machines = [] } = useMachinesSelect(idEnterprise);
  const options = mapMachinesToOptions(machines);
  // options: { value, label, data }[]
}
```

### Mutations

```tsx
import { useMachinesApi } from '@/hooks/use-machines-api';

function MyForm() {
  const { createMachine, updateMachine } = useMachinesApi();

  function onSubmit(data) {
    createMachine.mutate(data, {
      onSuccess: () => toast.success(t('machine.created')),
    });
  }
}
```

### Estado global fora de componente (em funcoes de API)

```tsx
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';

// Acesso direto ao store (sem hook)
const idEnterprise = useEnterpriseFilter.getState().idEnterprise;
```

---

## Padrao de Implementacao

Consulte [`docs/api-hooks.md`](../../docs/api-hooks.md) para:
- Estrutura completa com query keys, useQuery e useMutation
- Lista paginada com `placeholderData`
- Upload de arquivo com FormData
- Download de Blob (CSV/Excel)
- Ativacao/desativacao de registros
- URLSearchParams para arrays
- Estruturas de resposta comuns
