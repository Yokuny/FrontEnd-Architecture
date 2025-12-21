# Arquitetura do Projeto

> Esta é a nova arquitetura do front-end utilizando **TanStack Router**, focada em modularidade e escalabilidade.

## 🎨 Componentes UI

### ShadCN UI
- **Localização**: [`src/components/ui`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/ui)
- **Uso**: Todos os componentes base do projeto (40+ componentes)
- **Importante**: Sempre usar estes componentes para manter integridade visual

### Componentes de Seleção (Selects)
- **Localização**: [`src/components/selects`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/selects)
- **Exportação Central**: [`src/components/selects/index.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/selects/index.ts)

Estes são componentes de seleção especializados, geralmente integrados com a API:

#### 📋 Mapeamento: Legado para Novo
Ao converter componentes do `iotlog-frontend/src/components/Select` para a nova arquitetura, utilize obrigatoriamente a versão em `src/components/selects`.

| Nome Legado (SelectX) | Novo Nome (XSelect) |
| :--- | :--- |
| `SelectAlertType` | `AlertTypeSelect` |
| `SelectCMMSEquipment` | `CmmsEquipmentSelect` |
| `SelectCondition` | `ConditionSelect` |
| `SelectConsumptionGroup` | `ConsumptionGroupSelect` |
| `SelectConsumptionMachine` | `ConsumptionMachineSelect` |
| `SelectContractAssetEnterprise` | `ContractAssetEnterpriseSelect` |
| `SelectCustomer` | `CustomerSelect` |
| `SelectEnterprise` | `EnterpriseSelect` |
| `SelectEnterprisePreferred` | `EnterprisePreferredSelect` |
| `SelectEnterpriseWithSetup` | `EnterpriseWithSetupSelect` |
| `SelectFasPlanner` | `FasPlannerSelect` |
| `SelectFasType` | `FasTypeSelect` |
| `SelectFence` | `FenceSelect` |
| `SelectFenceType` | `FenceTypeSelect` |
| `SelectFilterEnterprise` | `EnterpriseFilterSelect` |
| `SelectFleet` | `FleetSelect` |
| `SelectFleetVessels` | `FleetVesselsSelect` |
| `SelectForm` | `FormSelect` |
| `SelectLanguage` | `LanguageFormSelect` |
| `SelectLanguageForm` | `LanguageFormSelect` |
| `SelectLevel` | `LevelSelect` |
| `SelectMachine` | `MachineSelect` |
| `SelectMachineEnterprise` | `MachineByEnterpriseSelect` |
| `SelectMaintenancePlan` | `MaintenancePlanSelect` |
| `SelectMaintenancePlanByMachine` | `MaintenancePlanByMachineSelect` |
| `SelectMaintenanceType` | `MaintenanceTypeSelect` |
| `SelectManagerPerson` | `MachineManagerSelect` |
| `SelectModelMachine` | `ModelMachineSelect` |
| `SelectOperationsContract` | `OperationsContractSelect` |
| `SelectOsOption` | `OsOptionSelect` |
| `SelectParams` | `ParamsSelect` |
| `SelectPart` | `PartSelect` |
| `SelectPartByMachine` | `PartByMachineSelect` |
| `SelectPlatformEnterprise` | `PlatformEnterpriseSelect` |
| `SelectPort` | `PortSelect` |
| `SelectPriority` | `PrioritySelect` |
| `SelectProductService` | `ProductServiceSelect` |
| `SelectQLP` | `QlpSelect` |
| `SelectRole` | `RoleSelect` |
| `SelectSafety` | `SafetySelect` |
| `SelectScale` | `ScaleSelect` |
| `SelectSensor` | `SensorSelect` |
| `SelectSensorByAssets` | `SensorByAssetsSelect` |
| `SelectSensorByEnterprise` | `SensorByEnterpriseSelect` |
| `SelectSensorByMachine` | `SensorByMachineSelect` |
| `SelectStatus` | `StatusSelect` |
| `SelectSupplier` | `SupplierSelect` |
| `SelectTypeMachine` | `TypeMachineSelect` |
| `SelectTypeProblem` | `TypeProblemSelect` |
| `SelectTypeSensor` | `TypeSensorSelect` |
| `SelectTypeUser` | `UserTypeSelect` |
| `SelectUserCodeIntegration` | `UserCodeIntegrationSelect` |
| `SelectUserRole` | `UserRoleSelect` |
| `SelectUserSamePermission` | `UserSamePermissionSelect` |
| `SelectUserTeam` | `UserTeamSelect` |
| `SelectUsers` | `UserSelect` |
| `SelectView` | `ViewSelect` |

> **REGRA OBRIGATÓRIA**: Nunca utilize placeholders ou seletores genéricos se um componente especializado existir nesta lista. Se encontrar um componente legado da arquitetura anterior, ele **DEVE** ser importado de `src/components/selects`.

### Componentes Prontos

#### Formulários
- [`form-advanced-7.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/form-advanced-7.tsx) - Formulário avançado
- [`form-patterns-3.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/form-patterns-3.tsx) - Padrões de formulário

#### Estatísticas
- [`stats-03.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/stats-03.tsx) - Cards de estatísticas
- [`stats-09.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/stats-09.tsx) - Cards de estatísticas

#### Estados Vazios
- [`empty-standard-5.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/empty-standard-5.tsx) - Componente para quando não há dados

#### Seleção Múltipla
- [`combobox-11.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/shadcn-studio/combobox/combobox-11.tsx) - Input de seleção múltipla

### Exemplo de Importação
Ver: [`src/routes/_public/auth/index.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_public/auth/index.tsx)

---

## 🛣️ Rotas (TanStack Router)

### Estrutura
- **Localização**: [`src/routes`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes)
- **Config**: [`vite.config.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/vite.config.ts) - `routeFileIgnorePrefix: "@"`

### Organização de Pastas

```
src/routes/
├── _public/
│   └── auth/
│       ├── @components/     # Componentes da rota
│       ├── @consts/         # Valores fixos
│       ├── @hooks/          # Logic (Form, Queries, Handlers)
│       ├── @interface/      # Tipagens e schemas Zod
│       ├── index.tsx        # Rota principal
│       ├── register.tsx     # Subrota
│       └── reset-password.tsx
```

**Convenções**:
- Pastas com `@` são ignoradas pelo router
- `@components` - Componentes específicos da rota
- `@consts` - Constantes e valores fixos
- `@hooks` - Lógica de formulários (useForm), Handlers e Queries locais
- `@interface` - Types, interfaces e schemas Zod

### Criar Rota

```tsx
import { createFileRoute } from "@tanstack/router";

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
  validateSearch: registerSearchSchema,
});
```

**Exemplos**:
- [`register.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_public/auth/register.tsx)
- [`reset-password.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_public/auth/reset-password.tsx)

---

## 🔄 Estado e API

### Localização
- **Hooks**: [`src/hooks`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks)

### Stack
- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Requisições e cache

### Padrões de Hooks

#### API Hook (TanStack Query)
As funções de API devem utilizar o `ApiClient` centralizado ([`src/lib/api/client.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/api/client.ts)), que simplifica as chamadas ao gerenciar:
- **Versionamento Automático**: O `/api/v1` já está na `baseURL`. **NUNCA** repita esse prefixo nas URLs internas dos hooks.
- **Suporte a v2**: Basta enviar `{ isV2: true }` nas opções para alternar para a base `/api/v2`.
- **Contexto de Autenticação**: O Token JWT e o `idEnterprise` são anexados automaticamente aos cabeçalhos.

```tsx
// src/hooks/use-auth-api.ts
export const useAuthApi = () => {
  const login = useMutation({...});
  const register = useMutation({...});
  return { login, register };
};
```
Ver: [`use-auth-api.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks/use-auth-api.ts)

#### Store Hook (Zustand)
```tsx
// src/hooks/use-auth.ts
export const useAuth = create<AuthStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```
Ver: [`use-auth.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks/use-auth.ts)

#### Estado Simples
```tsx
// src/hooks/use-sidebar-toggle.ts
export const useSidebarToggle = create<SidebarToggleStore>()(...);
```
Ver: 
- [`use-sidebar-toggle.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks/use-sidebar-toggle.ts)
- [`use-locale.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks/use-locale.ts)

---

## 🌍 Internacionalização (i18n)

### Estrutura de Arquivos
- **Traduções**: [`translations/`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/translations)
  - `en.json`: Inglês (Source of truth)
  - `es.json`: Espanhol
  - `pt.json`: Português
- **Hook de Idioma**: [`src/hooks/use-locale.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks/use-locale.ts)

### Como Usar Traduções

#### 1. No JSX (Componentes)
Para a maioria dos textos na interface, use o componente `<FormattedMessage />`.

```tsx
import { FormattedMessage } from "react-intl";

// Uso simples
<FormattedMessage id="login.title" defaultMessage="Bem-vindo" />

// Com valores dinâmicos
<FormattedMessage 
  id="message.users.role.quantity" 
  values={{ quantity: '5' }}
/>
```

#### 2. Fora do JSX (Placeholders, Toasts, Hooks)
Use o hook `useIntl` para obter a instância `intl` e formatar mensagens programaticamente.

```tsx
import { useIntl } from "react-intl";

const MyComponent = () => {
  const intl = useIntl();

  const placeholder = intl.formatMessage({ id: "search.placeholder" });
  
  const handleNotify = () => {
    toast.success(intl.formatMessage({ id: "save.success" }));
  };

  return <input placeholder={placeholder} />;
};
```

#### 3. Adicionando Novos Textos
1. Adicione a chave no [`translations/en.json`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/translations/en.json) (use pontos para categorizar, ex: `auth.login.title`).
2. Replique a chave em `pt.json` e `es.json`.
3. Use o ID no seu componente.

> **Dica**: Sempre tente fornecer um `defaultMessage` para o `<FormattedMessage />` para evitar telas vazias caso a chave falhe no carregamento.

---

## 🏗️ Padrões de Interface (@interface)

Cada rota principal ou entidade deve ter sua própria pasta `@interface` contendo:
- **Schemas Zod**: Para validação de formulários e runtime.
- **Types/Interfaces**: Derivados dos schemas ou definidos manualmente para listagens.

### Exemplo: Permissões
- **Roles**: [`src/routes/_private/permissions/roles/@interface/role.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_private/permissions/roles/@interface/role.ts)
- **Users**: [`src/routes/_private/permissions/users/@interface/user.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_private/permissions/users/@interface/user.ts)

#### Conversão de Legado para Novo Padrão:
Ao converter componentes do `iotlog-frontend`:
1. **Lógica de Dados em Hooks**: Processos de fetch inicial (como o `loadingEdit`), gerenciamento de formulário e ações de salvar/deletar devem ser movidos para uma pasta `@hooks` dentro da pasta da rota (ex: `src/routes/_private/permissions/roles/@hooks/use-role-form.ts`).
2. **Seletores Globais**: Se a página legada possui seletores de contexto global (como o `SelectEnterprise` ou `SelectEnterpriseWithSetup`), estes DEVEM ser incluídos na nova versão, geralmente antes dos campos específicos do formulário.
3. **Componentes de Seleção Especializados**: Sempre verifique em [`src/components/selects`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/selects) se já existe um componente de seleção para o campo (ex: `SensorByAssetsSelect`, `MachineSelect`, etc.). Use-os em vez de criar seletores genéricos ou placeholders.
4. **Zod e Tipagem**: Use o arquivo `.ts` na pasta `@interface` para definir o schema e inferir os tipos.

---

## 🛠️ Exemplo de Estrutura de Pasta de Rota

```
src/routes/minha-rota/
├── @components/     # Componentes visuais específicos
├── @hooks/          # Lógica, React Query, Form Handling
├── @interface/      # Schemas Zod e Types
├── @consts/         # Constantes
└── index.tsx        # Ponto de entrada (View)
```

---

## 📋 Checklist de Desenvolvimento

### Criar Nova Página
- [ ] Criar pasta em `src/routes/`
- [ ] Criar subpastas: `@components`, `@consts`, `@interface`
- [ ] Definir rota com `createFileRoute`
- [ ] Adicionar traduções em `translations/*.json`
- [ ] Usar componentes de `src/components/ui`

### Criar Novo Hook
- [ ] Definir em `src/hooks/`
- [ ] Usar Zustand para estado global
- [ ] Usar TanStack Query para API
- [ ] **Importante**: Não incluir `/api/v1` manualmente na URL (o `ApiClient` já possui na `baseURL`)
- [ ] Exportar tipos e interfaces

### Adicionar Texto
- [ ] Usar `<FormattedMessage id="..." />`
- [ ] Adicionar chave em `translations/en.json`
- [ ] Adicionar chave em `translations/es.json`
- [ ] Adicionar chave em `translations/pt.json`
