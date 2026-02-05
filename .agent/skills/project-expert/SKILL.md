---
name: project-expert
description: Expert na arquitetura do projeto FrontEnd-Architecture. Guia implementação de páginas, hooks, formulários e integração com TanStack/Zustand seguindo os padrões reais do codebase.
---

# Project Expert Skill

Expert especializado na arquitetura do projeto `FrontEnd-Architecture`. Este skill conhece profundamente os padrões de código reais do projeto e guia implementações seguindo exatamente as convenções estabelecidas.

---

## Tech Stack

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Runtime | Node.js | >=24 |
| Framework | React | 19 |
| Bundler | Vite | 7 |
| Router | TanStack Router | 1.x |
| Data Fetching | TanStack Query | 5.x |
| State | Zustand | 5.x |
| UI Library | ShadCN UI + Radix | - |
| Styling | TailwindCSS | 4.x |
| Forms | react-hook-form + zod | 7.x / 3.x |
| i18n | react-i18next | 16.x |
| Linter/Formatter | Biome | 2.x |
| Charts | Recharts + ECharts | 2.x / 6.x |

---

## Estrutura de Pastas de Rota

Toda rota segue esta estrutura dentro de `src/routes/_private/{module}/`:

```
src/routes/_private/{feature}/
├── index.tsx           # Página principal (listagem)
├── add.tsx             # Página de criação/edição
├── $id.tsx             # Página de detalhe (opcional)
├── @components/        # Componentes específicos da rota
│   └── {feature}-form.tsx
├── @consts/            # Valores fixos, enums, configs
│   └── {feature}.consts.ts
├── @hooks/             # Hooks específicos da rota
│   ├── use-{feature}-form.ts
│   └── use-{feature}-api.ts  # (se não for global)
├── @interface/         # Types, Interfaces, Schemas Zod
│   ├── {feature}.interface.ts
│   └── {feature}.schema.ts
└── @utils/             # Funções auxiliares (opcional)
```

**Regras:**
- PROIBIDO usar `.` para criar rotas (ex: `edit.$id.tsx` ❌)
- Toda pasta de rota DEVE ter `index.tsx`
- Hooks globais ficam em `src/hooks/`
- Hooks específicos ficam em `@hooks/`

---

## Padrão de Página de Listagem

Exemplo real de `src/routes/_private/register/geofences/index.tsx`:

```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useGeofences, useGeofencesApi } from '@/hooks/use-geofences-api';
import { GEOFENCE_TYPES_CONFIG } from './@consts/geofence-types';

// 1. Schema de validação dos search params
const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

// 2. Definição da rota
export const Route = createFileRoute('/_private/register/geofences/')({
  component: GeofenceListPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

// 3. Componente da página
function GeofenceListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page, size, search } = useSearch({ from: '/_private/register/geofences/' });
  const { idEnterprise } = useEnterpriseFilter();

  // 4. Fetch de dados
  const { data, isLoading } = useGeofences({
    idEnterprise,
    page: page - 1,
    size,
    search,
  });
  const { deleteGeofence } = useGeofencesApi();

  const items = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / size);

  // 5. Handlers
  const handleDelete = async (id: string) => {
    try {
      await deleteGeofence.mutateAsync(id);
      toast.success(t('delete.success'));
    } catch {
      toast.error(t('error.delete'));
    }
  };

  // 6. Render com estrutura obrigatória
  return (
    <Card>
      {/* CardHeader com título e ações */}
      <CardHeader title={t('geofences')}>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          {/* Input de busca */}
          <div className="relative w-full sm:max-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-9"
              defaultValue={search || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({
                    search: (prev: SearchParams) => ({
                      ...prev,
                      search: e.currentTarget.value || undefined,
                      page: 1,
                    }),
                  });
                }
              }}
            />
          </div>
          {/* Botão de adicionar */}
          <Button onClick={() => navigate({ to: '/register/geofences/add' })}>
            <Plus className="mr-2 size-4" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      {/* CardContent com lista */}
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : items.length === 0 ? (
          <DefaultEmptyData />
        ) : (
          <ItemGroup>
            {items.map((item) => (
              <Item
                key={item.id}
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate({ to: '/register/geofences/add', search: { id: item.id } })}
              >
                <div className="flex flex-1 items-center gap-4">
                  <ItemMedia variant="image">
                    <Flag className="size-5" />
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-base">{item.description}</ItemTitle>
                    <ItemDescription>{item.code}</ItemDescription>
                  </ItemContent>
                </div>

                {/* Menu de ações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate({ to: '/register/geofences/add', search: { id: item.id } })}>
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>

      {/* CardFooter com paginação */}
      {totalCount > 0 && (
        <CardFooter layout="multi">
          {/* Seletor de itens por página */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>{t('show')}</span>
            <Select value={String(size)} onValueChange={(val) => navigate({ search: (prev: SearchParams) => ({ ...prev, size: Number(val), page: 1 }) })}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>{t('per.page')}</span>
            <span className="ml-4 tabular-nums">{t('total')}: {totalCount}</span>
          </div>

          {/* Paginação */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && navigate({ search: (prev: SearchParams) => ({ ...prev, page: page - 1 }) })}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {/* ... números de página ... */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && navigate({ search: (prev: SearchParams) => ({ ...prev, page: page + 1 }) })}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
```

---

## Padrão de Página de Formulário

Exemplo real de `src/routes/_private/register/geofences/add.tsx`:

```tsx
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';

import { useGeofence, useGeofencesApi } from '@/hooks/use-geofences-api';
import { GeofenceForm } from './@components/geofence-form';
import { useGeofenceForm } from './@hooks/use-geofence-form';

// Schema para search params
const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/register/geofences/add')({
  component: GeofenceAddPage,
  validateSearch: searchSchema,
});

function GeofenceAddPage() {
  const { t } = useTranslation();
  const { id } = useSearch({ from: '/_private/register/geofences/add' });
  const { data: geofence, isLoading } = useGeofence(id);

  // Loading enquanto carrega dados para edição
  if (id && isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.geofence')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <GeofenceAddFormContent initialData={geofence} />;
}

function GeofenceAddFormContent({ initialData }: { initialData?: any }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteGeofence } = useGeofencesApi();

  // Preparar dados iniciais
  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      id: initialData.id,
      idEnterprise: initialData.idEnterprise,
      // ... mapear outros campos
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = useGeofenceForm(formData);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteGeofence.mutateAsync(initialData.id);
      toast.success(t('delete.success'));
      navigate({ to: '/register/geofences' });
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return (
    <Card>
      <CardHeader title={initialData ? t('edit.geofence') : t('add.geofence')} />

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <GeofenceForm />
          </CardContent>

          <CardFooter>
            {/* Botão de deletar (só na edição) */}
            {initialData && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={deleteGeofence.isPending || isPending}>
                    {deleteGeofence.isPending ? <Spinner className="mr-2 size-4" /> : <Trash2 className="mr-2 size-4" />}
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                      <Trash2 className="size-4" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Botão de salvar */}
            <Button type="submit" disabled={isPending} className="ml-auto min-w-[120px]">
              {isPending && <Spinner className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
```

---

## Padrão de Hook de Formulário

Arquivo: `@hooks/use-{feature}-form.ts`

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGeofencesApi } from '@/hooks/use-geofences-api';
import { type GeofenceFormData, geofenceFormSchema } from '../@interface/geofence.interface';

export function useGeofenceForm(initialData?: Partial<GeofenceFormData>) {
  const { createGeofence, updateGeofence } = useGeofencesApi();

  const form = useForm<GeofenceFormData>({
    resolver: zodResolver(geofenceFormSchema),
    values: initialData as GeofenceFormData,
    defaultValues: {
      color: '#3366FF',
      initializeTravel: false,
      // ... outros defaults
      ...initialData,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.id) {
      await updateGeofence.mutateAsync({ ...data, id: data.id });
    } else {
      await createGeofence.mutateAsync(data);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createGeofence.isPending || updateGeofence.isPending,
  };
}
```

---

## Padrão de Hook de API

Arquivo: `src/hooks/use-{feature}-api.ts`

```tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Geofence, GeofenceFormData } from '@/routes/_private/register/geofences/@interface/geofence.interface';

// 1. Query Keys centralizadas
export const geofencesKeys = {
  all: ['geofences'] as const,
  lists: () => [...geofencesKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...geofencesKeys.lists(), filters] as const,
  details: () => [...geofencesKeys.all, 'detail'] as const,
  detail: (id: string) => [...geofencesKeys.details(), id] as const,
};

// 2. Funções de API (privadas)
async function fetchGeofences(params?: Record<string, unknown>): Promise<{ data: Geofence[]; totalCount: number }> {
  const response = await api.get<{ data: Geofence[]; pageInfo: [{ count: number }] }>('/geofence/list', { params });
  return {
    data: response.data.data,
    totalCount: response.data.pageInfo?.[0]?.count || 0,
  };
}

async function fetchGeofence(id: string): Promise<Geofence> {
  const response = await api.get<Geofence>(`/geofence/find?id=${id}`);
  return response.data;
}

async function createGeofence(data: GeofenceFormData): Promise<Geofence> {
  const response = await api.post<Geofence>('/geofence', data);
  return response.data;
}

async function updateGeofence(data: GeofenceFormData & { id: string }): Promise<Geofence> {
  const response = await api.post<Geofence>('/geofence', data);
  return response.data;
}

async function deleteGeofence(id: string): Promise<void> {
  await api.delete(`/geofence?id=${id}`);
}

// 3. Hook de Query - Listagem
export function useGeofences(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: geofencesKeys.list(params),
    queryFn: () => fetchGeofences(params),
  });
}

// 4. Hook de Query - Detalhe
export function useGeofence(id?: string) {
  return useQuery({
    queryKey: geofencesKeys.detail(id ?? ''),
    queryFn: () => fetchGeofence(id ?? ''),
    enabled: !!id,
  });
}

// 5. Hook de Mutations
export function useGeofencesApi() {
  const queryClient = useQueryClient();

  const createGeofenceMutation = useMutation({
    mutationFn: createGeofence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
    },
  });

  const updateGeofenceMutation = useMutation({
    mutationFn: updateGeofence,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: geofencesKeys.detail(data.id) });
      }
    },
  });

  const deleteGeofenceMutation = useMutation({
    mutationFn: deleteGeofence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geofencesKeys.lists() });
    },
  });

  return {
    createGeofence: createGeofenceMutation,
    updateGeofence: updateGeofenceMutation,
    deleteGeofence: deleteGeofenceMutation,
  };
}
```

---

## Padrão de Interface/Schema

Arquivo: `@interface/{feature}.interface.ts`

```tsx
import { z } from 'zod';

// 1. Schema Zod para validação de formulário
export const geofenceFormSchema = z.object({
  id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  type: z.object({
    value: z.string().min(1, 'type.required'),
    label: z.string().optional(),
  }),
  code: z.string().min(1, 'code.required'),
  description: z.string().min(1, 'description.required'),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  color: z.string().min(1, 'color.required'),
  initializeTravel: z.boolean().default(false),
  finalizeTravel: z.boolean().default(false),
});

// 2. Type inferido do schema
export type GeofenceFormData = z.infer<typeof geofenceFormSchema>;

// 3. Interface para dados da API (response)
export interface Geofence {
  id: string;
  idEnterprise: string;
  enterprise?: {
    id: string;
    name: string;
  };
  type: {
    value: string;
    label?: string;
  };
  code: string;
  description: string;
  city?: string;
  state?: string;
  color: string;
  initializeTravel: boolean;
  finalizeTravel: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Padrão de Consts

Arquivo: `@consts/{feature}.consts.ts`

```tsx
import { Anchor, Box, MapPin, Navigation } from 'lucide-react';

// Enum de tipos
export const TYPE_GEOFENCE = {
  PORT: 'port',
  PIER: 'pier',
  ROUTE: 'route',
  OTHER: 'other',
} as const;

// Config de tipos com ícones e cores
export const GEOFENCE_TYPES_CONFIG = {
  [TYPE_GEOFENCE.PORT]: {
    icon: Anchor,
    color: 'text-success-500',
  },
  [TYPE_GEOFENCE.PIER]: {
    icon: Box,
    color: 'text-info-500',
  },
  [TYPE_GEOFENCE.ROUTE]: {
    icon: Navigation,
    color: 'text-destructive',
  },
  [TYPE_GEOFENCE.OTHER]: {
    icon: MapPin,
    color: 'text-primary-600',
  },
} as const;

// Valores fixos
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_COLOR = '#3366FF';
```

---

## Padrão de Componente de Formulário

Arquivo: `@components/{feature}-form.tsx`

```tsx
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { GeofenceFormData } from '../@interface/geofence.interface';

export function GeofenceForm() {
  const { t } = useTranslation();
  const form = useFormContext<GeofenceFormData>();

  // Definir seções do formulário
  const sections = [
    {
      title: t('general.information'),
      description: t('geofence.general.description'),
      fields: [
        // Select de empresa
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        // Input de descrição
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')} *</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('description')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        // Grid de campos
        <div key="row-type-code" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('code')} *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('code')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('advanced.settings'),
      description: t('geofence.advanced.description'),
      fields: [
        // Checkboxes em grid
        <div key="row-checks" className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="initializeTravel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('initialize.travel')}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
```

---

## Estado Global (Zustand)

Exemplo real de `src/hooks/use-enterprise-filter.ts`:

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EnterpriseFilterStore {
  idEnterprise: string;
  setIdEnterprise: (id: string) => void;
}

export const useEnterpriseFilter = create<EnterpriseFilterStore>()(
  persist(
    (set) => ({
      idEnterprise: '',
      setIdEnterprise: (id) => set({ idEnterprise: id }),
    }),
    {
      name: 'idEnterprise', // chave no localStorage
    },
  ),
);
```

**IMPORTANTE**: NUNCA use `localStorage.setItem` diretamente. Sempre use Zustand com `persist`.

---

## Componentes de Select (68 disponíveis)

Usar os componentes de `src/components/selects/` ao invés de criar Select do zero.

```tsx
import { EnterpriseSelect, MachineByEnterpriseSelect, UserSelect } from '@/components/selects';

// Single select
<EnterpriseSelect
  mode="single"
  value={idEnterprise}
  onChange={setIdEnterprise}
/>

// Multi select
<MachineByEnterpriseSelect
  mode="multi"
  idEnterprise={idEnterprise}
  value={selectedMachines}
  onChange={setSelectedMachines}
/>
```

**Props padrão:**
- `mode`: `'single' | 'multi'`
- `value`: `string | string[]`
- `onChange`: `(value) => void`
- `disabled?`: `boolean`
- `clearable?`: `boolean`
- `label?`: `string`
- `placeholder?`: `string`

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

---

## Hooks Globais (258 em `src/hooks/`)

**TOP 15 mais usados:**
| Hook | Usos | Descrição |
|------|------|-----------|
| `useEnterpriseFilter` | 90 | idEnterprise do filtro global |
| `useHasPermission` | 35 | Verifica permissões do usuário |
| `useSidebar` | 7 | Estado da sidebar |
| `useSidebarToggle` | 7 | Toggle da sidebar |
| `useCMMSKPIs` | 6 | KPIs do CMMS |
| `useIsMobile` | 5 | Detecta dispositivo mobile |
| `useMachinesByEnterpriseSelect` | 5 | Máquinas por empresa |
| `useEnterprisesSelect` | 4 | Empresas para select |
| `useUsersApi` | 4 | CRUD usuários |
| `usePartsApi` | 3 | CRUD peças |
| `useModelMachinesApi` | 3 | CRUD modelos |
| `usePlatformsApi` | 3 | CRUD plataformas |
| `useAuth` | 3 | Sessão e login |
| `useSensorsApi` | 3 | CRUD sensores |
| `useMachinesApi` | 3 | CRUD máquinas |

**ANTES de criar um hook**, verifique se já existe em `src/hooks/`!

---

## Internacionalização (i18n)

**CRÍTICO**: Toda string de UI DEVE usar `t('chave')`:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('page.title')}</h1>
      <p>{t('message', { name: 'User' })}</p>
      <Input placeholder={t('search.placeholder')} />
    </>
  );
}
```

Toda chave DEVE existir nos **3 arquivos**:
- `src/config/translations/pt.json`
- `src/config/translations/en.json`
- `src/config/translations/es.json`

Use **grep** para verificar se a chave já existe antes de criar.

---

## Formatação de Datas

**OBRIGATÓRIO**: Use `@/lib/formatDate` para toda formatação:

```tsx
import { formatDate } from '@/lib/formatDate';

// ✅ CORRETO
formatDate(date, 'dd/MM/yyyy');
formatDate(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");

// ❌ ERRADO - perde i18n
import { format } from 'date-fns';
format(date, 'dd/MM/yyyy');
```

---

## Checklist de Nova Feature

1. **Estrutura de Pastas**
   - [ ] Criar pasta em `src/routes/_private/{feature}/`
   - [ ] Criar `index.tsx` (listagem)
   - [ ] Criar `add.tsx` (formulário)
   - [ ] Criar `@interface/{feature}.interface.ts`
   - [ ] Criar `@hooks/use-{feature}-form.ts`
   - [ ] Criar `@components/{feature}-form.tsx` (se necessário)
   - [ ] Criar `@consts/{feature}.consts.ts` (se necessário)

2. **Hook de API**
   - [ ] Verificar se já existe em `src/hooks/`
   - [ ] Se não, criar em `src/hooks/use-{feature}-api.ts`

3. **Validações**
   - [ ] Todas strings usando `t('chave')`
   - [ ] Chaves i18n nos 3 arquivos
   - [ ] Datas com `@/lib/formatDate`
   - [ ] Estado persistente com Zustand (não localStorage)
   - [ ] Usando `DefaultLoading` e `DefaultEmptyData`

4. **Antes de Commitar**
   ```bash
   pnpm run format  # Biome
   pnpm run check   # TypeScript
   ```

---

## Exemplo de Resposta

"Para implementar a feature de Sensores, seguirei a arquitetura do projeto:

1. **Estrutura**: `src/routes/_private/register/sensors/`
   - `index.tsx` - Listagem com ItemGroup
   - `add.tsx` - Formulário com DefaultFormLayout
   - `@interface/sensor.interface.ts` - Schema Zod + Types
   - `@hooks/use-sensor-form.ts` - Hook de formulário

2. **Hook de API**: Verificarei se `useSensorsApi` já existe em `src/hooks/`

3. **Componentes**:
   - Wrapper: `Card > CardHeader > CardContent > CardFooter`
   - Lista: `ItemGroup > Item` com `ItemTitle/ItemDescription`
   - Form: `DefaultFormLayout` com sections

4. **Selects**: Usarei `MachineByEnterpriseSelect` e `EnterpriseSelect`

5. **i18n**: Adicionarei chaves em `pt.json`, `en.json`, `es.json`"
