# Arquitetura do Projeto

> Esta é a nova arquitetura do front-end utilizando **TanStack Router**, focada em modularidade e escalabilidade.

---

## ⚠️ REGRA CRÍTICA: Estrutura de Pastas de Rota

> **LEIA ISTO PRIMEIRO** - A estrutura a seguir é OBRIGATÓRIA para todas as rotas.

### Estrutura Padrão de uma Rota

> **IMPORTANTE**: Cada página deve ter sua **própria pasta**, contendo as subpastas `@hooks`, `@interface`, etc.

```
src/routes/_private/minha-funcionalidade/
├── minha-pagina/              # 👈 PASTA DA PÁGINA
│   ├── @components/           # Componentes visuais EXCLUSIVOS desta página
│   ├── @consts/               # Constantes e valores fixos
│   ├── @hooks/                # ⚠️ HOOKS DE API E LÓGICA LOCAL
│   ├── @interface/            # Types, Interfaces e Schemas Zod
│   └── minha-pagina.tsx       # Arquivo da rota (VIEW PURA)
├── outra-pagina/
│   ├── @hooks/
│   ├── @interface/
│   └── outra-pagina.tsx
└── index.tsx                  # Listagem/página inicial do módulo
```

#### Exemplo Real:

```
src/routes/_private/set-up-company/
├── setup-email/
│   ├── @hooks/
│   │   ├── use-setup-enterprise-api.ts
│   │   └── use-email-config-form.ts
│   ├── @interface/
│   │   └── setup-email.ts
│   └── setup-email.tsx        # Rota: /set-up-company/setup-email
└── setup-sso/
    ├── @hooks/
    ├── @interface/
    └── setup-sso.tsx          # Rota: /set-up-company/setup-sso
```

### 🔴 Regras das Pastas `@`

| Pasta | Conteúdo | Quando Usar |
|-------|----------|-------------|
| `@components/` | Componentes React visuais | Componente usado APENAS nesta rota |
| `@consts/` | Arrays, objetos, enums fixos | Valores que não mudam em runtime |
| `@hooks/` | Hooks de API e lógica de formulário | Requisições específicas da rota |
| `@interface/` | Types, Interfaces, Schemas Zod | Tipagens específicas da rota |

### 🔴 Regra de Hooks de API (IMPORTANTE)

**ANTES de criar qualquer hook de API em `@hooks/`, você DEVE:**

1. **Verificar se já existe em [`src/hooks/`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks)**
   - `use-users-api.ts` → Operações de usuários
   - `use-roles-api.ts` → Operações de perfis
   - `use-enterprises-api.ts` → Operações de empresas
   - etc.

2. **Se o hook existe em `src/hooks/`** → USE-O, não crie um novo
3. **Se NÃO existe e é específico da rota** → Crie em `@hooks/`
4. **Se NÃO existe e é reutilizável** → Crie em `src/hooks/`

#### Exemplo de Decisão:

```
Preciso de useUsers() para listar usuários?
  └─ Já existe em src/hooks/use-users-api.ts? 
       ├─ SIM → import { useUsers } from '@/hooks/use-users-api'
       └─ NÃO → Criar em src/hooks/use-users-api.ts (reutilizável)

Preciso de useUserForm() para gerenciar formulário de usuário?
  └─ É específico da rota de edição de usuário?
       ├─ SIM → Criar em @hooks/use-user-form.ts
       └─ NÃO → Avaliar se deve ir em src/hooks/
```

### Localização dos Hooks Globais

**[`src/hooks/`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks)** - Hooks reutilizáveis em múltiplas rotas:

| Hook | Descrição |
|------|-----------|
| `use-auth-api.ts` | Login, logout, reset de senha |
| `use-users-api.ts` | CRUD de usuários e permissões |
| `use-roles-api.ts` | CRUD de perfis |
| `use-enterprises-api.ts` | CRUD de empresas |
| `use-auth.ts` | Estado de autenticação (Zustand) |
| `use-locale.ts` | Estado de idioma |

---

## 🎨 Componentes UI

### ShadCN UI
- **Localização**: [`src/components/ui`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/ui)
- **Uso**: Todos os componentes base do projeto (40+ componentes)
- **Importante**: Sempre usar estes componentes para manter integridade visual

### Componentes de Seleção (Selects)
- **Localização**: [`src/components/selects`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/selects)
- **Exportação Central**: [`src/components/selects/index.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/selects/index.ts)

#### 📋 Mapeamento: Legado para Novo

| Nome Legado (SelectX) | Novo Nome (XSelect) |
| :--- | :--- |
| `SelectEnterprise` | `EnterpriseSelect` |
| `SelectEnterpriseWithSetup` | `EnterpriseWithSetupSelect` |
| `SelectCustomer` | `CustomerSelect` |
| `SelectRole` | `RoleSelect` |
| `SelectUsers` | `UserSelect` |
| `SelectMachine` | `MachineSelect` |
| `SelectSensor` | `SensorSelect` |
| `SelectSupplier` | `SupplierSelect` |
| `SelectLanguage` | `LanguageFormSelect` |

> **REGRA**: Nunca crie seletores genéricos se um componente especializado existir. Importe de `@/components/selects`.

### Componentes Prontos

#### Formulários
- [`form-advanced-7.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/form-advanced-7.tsx)
- [`form-patterns-3.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/form-patterns-3.tsx)

#### Estatísticas
- [`stats-03.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/stats-03.tsx)
- [`stats-09.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/stats-09.tsx)

#### Estados Vazios
- [`empty-standard-5.tsx`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/empty-standard-5.tsx)

---

## 🛣️ Rotas (TanStack Router)

### Estrutura Geral
- **Localização**: [`src/routes`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes)
- **Config**: [`vite.config.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/vite.config.ts) - `routeFileIgnorePrefix: "@"`

### Convenções de Nome de Arquivo

| Arquivo | Rota Gerada |
|---------|-------------|
| `index.tsx` | `/minha-rota/` |
| `add.tsx` | `/minha-rota/add` |
| `edit.$id.tsx` | `/minha-rota/edit/:id` |
| `$id.tsx` | `/minha-rota/:id` |

### Definir Rota

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/permissions/users/")({
  component: ListUsersPage,
});
```

### Search Params com Validação

```tsx
import { z } from 'zod';

const searchSchema = z.object({
  id: z.string().optional(),
  filter: z.string().optional(),
});

export const Route = createFileRoute("/_private/minha-rota/")({
  component: MinhaPage,
  validateSearch: searchSchema,
});

// No componente:
const { id, filter } = useSearch({ from: '/_private/minha-rota/' });
```

---

## 🔄 Estado e API

### Cliente de API
- **Localização**: [`src/lib/api/client.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/api/client.ts)
- **Base URL**: `/api/v1` (já configurado, NUNCA repita)
- **V2**: Use `{ isV2: true }` nas opções

### Stack
- **Zustand** - Gerenciamento de estado global
- **TanStack Query** - Requisições e cache

### Padrão de Hook de API

```tsx
// src/hooks/use-users-api.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Query keys centralizadas
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
};

// Hook de Query
export function useUsers() {
  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: async () => {
      const response = await api.get('/user/list');
      return response.data;
    },
  });
}

// Hook de Mutations
export function useUsersApi() {
  const queryClient = useQueryClient();
  
  const createUser = useMutation({
    mutationFn: (data) => api.post('/user', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersKeys.lists() }),
  });
  
  return { createUser };
}
```

### Padrão de Hook de Formulário (em @hooks/)

```tsx
// src/routes/_private/users/@hooks/use-user-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUsersApi } from '@/hooks/use-users-api';
import { userFormSchema, type UserFormData } from '../@interface/user';

export function useUserForm(initialData?: UserFormData) {
  const { createUser, updateUser } = useUsersApi();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData,
  });
  
  const onSubmit = form.handleSubmit(async (data) => {
    if (initialData?.id) {
      await updateUser.mutateAsync(data);
    } else {
      await createUser.mutateAsync(data);
    }
  });
  
  return { form, onSubmit, isPending: createUser.isPending || updateUser.isPending };
}
```

---

## 🌍 Internacionalização (i18n)

### Arquivos de Tradução
- [`src/lib/translations/en.json`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/translations/en.json)
- [`src/lib/translations/es.json`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/translations/es.json)
- [`src/lib/translations/pt.json`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/translations/pt.json)

### Uso

```tsx
// No JSX
<FormattedMessage id="save" defaultMessage="Salvar" />

// Em código (placeholders, toasts)
const intl = useIntl();
toast.success(intl.formatMessage({ id: 'success.save' }));
```

---

## 📋 Checklist de Migração de Página Legada

### 1. Analisar Página Legada
- [ ] Identificar componentes de seleção (`SelectX`)
- [ ] Identificar chamadas de API (`Fetch.get/post`)
- [ ] Identificar campos do formulário

### 2. Verificar Hooks Existentes
- [ ] Checar [`src/hooks/`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/hooks) para hooks de API existentes
- [ ] Reutilizar se existir, criar se não

### 3. Criar Estrutura
- [ ] Criar pasta da rota em `src/routes/_private/`
- [ ] Criar subpastas: `@components/`, `@hooks/`, `@interface/`, `@consts/`
- [ ] Criar arquivo de rota (`index.tsx`, `add.tsx`, etc.)

### 4. Implementar
- [ ] Usar componentes de `src/components/ui`
- [ ] Schemas Zod em `@interface/`
- [ ] Hook de formulário em `@hooks/` (se necessário)
- [ ] Página com componentes Shadcn UI
- [ ] Adicionar ou buscar as traduções em `translations/*.json`

### 5. Conversões Obrigatórias

| Legado | Novo |
|--------|------|
| `@paljs/ui` | `@/components/ui/*` |
| `react-router-dom` | `@tanstack/react-router` |
| `react-toastify` | `sonner` |
| `Fetch.get/post` | `api.get/post` (de `@/lib/api/client`) |
| `SelectX` | `XSelect` (de `@/components/selects`) |
| `styled-components` | Tailwind CSS |
| `window.location.search` | `useSearch` com Zod |
