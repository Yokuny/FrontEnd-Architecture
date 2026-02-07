---
name: react-patterns
description: Especialista em padrões React para o projeto FrontEnd-Architecture. Guia implementação de componentes, hooks, state management e integração com TanStack/Zustand.
---

# React Patterns Skill

Skill especializada em padrões React otimizados para o projeto FrontEnd-Architecture. Use para implementar componentes, criar hooks customizados, gerenciar estado e integrar com TanStack Query/Router e Zustand.

---

## Stack React do Projeto

```
React 19 + TypeScript
├── Routing      → TanStack Router (file-based)
├── Server State → TanStack Query
├── Client State → Zustand (persist)
├── Forms        → react-hook-form + zod
├── UI           → ShadCN + Radix
└── Styling      → TailwindCSS 4
```

---

## Padrões de Componentes

### 1. Declaração de Componentes

**SEMPRE** use `function` declarations para componentes:

```tsx
// ✅ CORRETO
function UserCard({ user }: UserCardProps) {
  return (
    <Item>
      <ItemTitle>{user.name}</ItemTitle>
      <ItemDescription>{user.email}</ItemDescription>
    </Item>
  );
}

// ❌ EVITAR
const UserCard = ({ user }: UserCardProps) => { ... };
const UserCard: React.FC<UserCardProps> = ({ user }) => { ... };
```

### 2. Props Typing

Defina tipos em arquivos separados (`@interface/`):

```tsx
// @interface/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

// Component
import type { UserCardProps } from './@interface/user.types';

function UserCard({ user, onSelect }: UserCardProps) { ... }
```

### 3. Estrutura de Componente

Ordem recomendada dentro do componente:

```tsx
function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 1. Hooks de contexto/router
  const { t } = useTranslation();
  const navigate = Route.useNavigate();

  // 2. Hooks de estado global (Zustand)
  const { idEnterprise } = useEnterpriseFilter();

  // 3. Hooks de dados (TanStack Query)
  const { data, isLoading } = useUsers();

  // 4. Hooks de estado local
  const [isOpen, setIsOpen] = useState(false);

  // 5. Valores derivados / useMemo
  const filteredUsers = useMemo(() =>
    data?.filter(u => u.active),
    [data]
  );

  // 6. Callbacks / useCallback
  const handleSelect = useCallback((user: User) => {
    onSelect?.(user);
    setIsOpen(false);
  }, [onSelect]);

  // 7. Effects (usar com moderação)
  useEffect(() => { ... }, []);

  // 8. Early returns
  if (isLoading) return <DefaultLoading />;
  if (!data?.length) return <DefaultEmptyData />;

  // 9. Render
  return ( ... );
}
```

### 4. Early Returns

Use early returns para condições de borda:

```tsx
function UserProfile({ userId }: { userId?: string }) {
  const { data: user, isLoading, error } = useUser(userId);

  // Ordem: loading → error → empty → success
  if (isLoading) return <DefaultLoading />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <DefaultEmptyData />;

  return (
    <Card>
      <CardContent>{user.name}</CardContent>
    </Card>
  );
}
```

---

## Padrões de Hooks

### 1. Hook de API (Query)

```tsx
// src/hooks/use-users-api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Query keys centralizadas
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook de listagem
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters ?? {}),
    queryFn: async () => {
      const response = await api.get('/user/list', { params: filters });
      return response.data as User[];
    },
  });
}

// Hook de detalhe
export function useUser(id?: string) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: async () => {
      const response = await api.get(`/user/${id}`);
      return response.data as User;
    },
    enabled: !!id,
  });
}

// Hook de mutations
export function useUserMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: CreateUserDTO) => api.post('/user', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      api.put(`/user/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return { create, update, remove };
}
```

### 2. Hook de Formulário

```tsx
// @hooks/use-user-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { useUserMutations } from '@/hooks/use-users-api';
import { userFormSchema, type UserFormData } from '../@interface/user.schema';

interface UseUserFormOptions {
  initialData?: Partial<UserFormData>;
  userId?: string;
  onSuccess?: () => void;
}

export function useUserForm({ initialData, userId, onSuccess }: UseUserFormOptions = {}) {
  const navigate = useNavigate();
  const { create, update } = useUserMutations();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      ...initialData,
    },
  });

  const isEditing = !!userId;
  const isPending = create.isPending || update.isPending;

  async function onSubmit(data: UserFormData) {
    try {
      if (isEditing) {
        await update.mutateAsync({ id: userId, data });
        toast.success(t('user.updated'));
      } else {
        await create.mutateAsync(data);
        toast.success(t('user.created'));
      }
      onSuccess?.() ?? navigate({ to: '/users' });
    } catch (error) {
      toast.error(t('error.generic'));
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    isEditing,
  };
}
```

### 3. Hook de Filtros com Zustand

```tsx
// @hooks/use-user-filters.ts
import { create } from 'zustand';

interface UserFiltersState {
  search: string;
  status: 'all' | 'active' | 'inactive';
  setSearch: (search: string) => void;
  setStatus: (status: 'all' | 'active' | 'inactive') => void;
  reset: () => void;
}

const initialState = {
  search: '',
  status: 'all' as const,
};

export const useUserFilters = create<UserFiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));
```

### 4. Hook Customizado (Lógica Reutilizável)

```tsx
// src/hooks/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Uso
function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useUsers({ search: debouncedSearch });

  return <Input value={search} onChange={e => setSearch(e.target.value)} />;
}
```

---

## State Management Patterns

### 1. Quando Usar Cada Tipo de Estado

| Tipo | Ferramenta | Exemplo |
|------|------------|---------|
| Server State | TanStack Query | Lista de usuários, detalhes |
| Form State | react-hook-form | Campos de formulário |
| UI Local | useState | Modal aberto, tab ativa |
| UI Global | Zustand | Sidebar, tema, filtro global |
| Persistente | Zustand + persist | Token, preferências |

### 2. Zustand com Persist

```tsx
// src/stores/use-preferences-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  sidebarCollapsed: boolean;
  tablePageSize: number;
  toggleSidebar: () => void;
  setPageSize: (size: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      tablePageSize: 10,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setPageSize: (size) => set({ tablePageSize: size }),
    }),
    {
      name: 'user-preferences',
    }
  )
);
```

### 3. Derivar Estado (Não Duplicar)

```tsx
// ❌ ERRADO - Estado duplicado
const [users, setUsers] = useState<User[]>([]);
const [activeUsers, setActiveUsers] = useState<User[]>([]);

useEffect(() => {
  setActiveUsers(users.filter(u => u.active));
}, [users]);

// ✅ CORRETO - Estado derivado
const [users, setUsers] = useState<User[]>([]);
const activeUsers = useMemo(() => users.filter(u => u.active), [users]);
```

---

## Padrões de Renderização

### 1. Listas

```tsx
function UserList({ users }: { users: User[] }) {
  if (!users.length) return <DefaultEmptyData />;

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### 2. Conditional Rendering

```tsx
// Simples - &&
{hasPermission && <AdminPanel />}

// If-else - ternário
{isLoading ? <Spinner /> : <Content />}

// Múltiplas condições - early return ou variável
function StatusBadge({ status }: { status: Status }) {
  const config = {
    active: { label: t('status.active'), variant: 'success' },
    inactive: { label: t('status.inactive'), variant: 'secondary' },
    pending: { label: t('status.pending'), variant: 'warning' },
  }[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
```

### 3. Conditional Classes

```tsx
import { cn } from '@/lib/utils';

function Button({ variant, size, className, ...props }) {
  return (
    <button
      className={cn(
        'rounded-md font-medium',
        variant === 'primary' && 'bg-primary text-white',
        variant === 'outline' && 'border border-input bg-transparent',
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg',
        className
      )}
      {...props}
    />
  );
}
```

---

## Padrões de Página

### 1. Página de Listagem

```tsx
// src/routes/_private/users/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DefaultLoading } from '@/components/default-loading';
import { DefaultEmptyData } from '@/components/default-empty-data';

import { useUsers } from '@/hooks/use-users-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';

export const Route = createFileRoute('/_private/users/')({
  component: UsersPage,
});

function UsersPage() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  const { data, isLoading } = useUsers({ idEnterprise });

  if (isLoading) return <DefaultLoading />;

  return (
    <Card>
      <CardHeader title={t('users.title')}>
        <Button onClick={() => navigate({ to: '/users/add' })}>
          <Plus className="size-4" />
          {t('btn.new')}
        </Button>
      </CardHeader>

      <CardContent>
        {!data?.length ? (
          <DefaultEmptyData />
        ) : (
          <UserTable users={data} />
        )}
      </CardContent>

      <CardFooter layout="single">
        {/* Pagination */}
      </CardFooter>
    </Card>
  );
}
```

### 2. Página de Formulário

```tsx
// src/routes/_private/users/add.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { DefaultFormLayout } from '@/components/default-form-layout';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useUserForm } from './@hooks/use-user-form';

export const Route = createFileRoute('/_private/users/add')({
  component: AddUserPage,
});

function AddUserPage() {
  const { t } = useTranslation();
  const { form, onSubmit, isPending } = useUserForm();

  return (
    <Card>
      <CardHeader />

      <CardContent>
        <DefaultFormLayout>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? t('saving') : t('save')}
              </Button>
            </form>
          </Form>
        </DefaultFormLayout>
      </CardContent>
    </Card>
  );
}
```

---

## Anti-Patterns (EVITAR)

### 1. Props Drilling Excessivo

```tsx
// ❌ EVITAR
<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Header user={user} />
    </Page>
  </Layout>
</App>

// ✅ CORRETO - Context ou Zustand
const { user } = useAuth();
```

### 2. useEffect para Sincronizar Estado

```tsx
// ❌ EVITAR
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0));
}, [items]);

// ✅ CORRETO - Derivar
const total = useMemo(() =>
  items.reduce((sum, i) => sum + i.price, 0),
  [items]
);
```

### 3. Fetch em useEffect

```tsx
// ❌ EVITAR
useEffect(() => {
  fetch('/api/users').then(setUsers);
}, []);

// ✅ CORRETO - TanStack Query
const { data: users } = useUsers();
```

### 4. Estado Desnecessário

```tsx
// ❌ EVITAR
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ CORRETO - Derivar inline
const fullName = `${firstName} ${lastName}`;
```

---

## Checklist de Implementação

Antes de finalizar um componente, verifique:

- [ ] Usa `function` declaration (não arrow function)?
- [ ] Props tipadas em arquivo separado (`@interface/`)?
- [ ] Early returns para loading/error/empty?
- [ ] `DefaultLoading` e `DefaultEmptyData` quando aplicável?
- [ ] Strings usando `t('key')` com chaves nos 3 arquivos i18n?
- [ ] Datas formatadas com `@/lib/formatDate`?
- [ ] Estado derivado ao invés de duplicado?
- [ ] TanStack Query para dados do servidor?
- [ ] Zustand persist para estado global persistente?
- [ ] Sem `localStorage.setItem` direto?
- [ ] Hook existente em `src/hooks/` verificado antes de criar novo?
