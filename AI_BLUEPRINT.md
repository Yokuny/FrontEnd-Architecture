# AI_BLUEPRINT.md

Knowledge base for AI agents migrating legacy code to this architecture.

---

## 1. ROUTING PROTOCOL

### Mandatory Rules

- Routes are created by **folders**, not files with `.` in names
- Every route folder **MUST** contain `index.tsx`
- **FORBIDDEN**: `edit.$id.tsx`, `users.$id.tsx`
- **ALLOWED**: `edit/index.tsx`, `users/index.tsx`, `edit/$id.tsx`, `users/$add.tsx`

### Route Creation Template

```tsx
// src/routes/_private/{module}/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/{module}/')({\
  component: ModulePage,
});

function ModulePage() {
  return (/* ... */);
}
```

### Search Parameters

```tsx
import { z } from 'zod';

const searchSchema = z.object({
  id: z.string().optional(),
  page: z.number().optional().default(1),
});

export const Route = createFileRoute('/_private/{module}/')({
  component: ModulePage,
  validateSearch: searchSchema,
});

// Access inside component:
const { id, page } = Route.useSearch();
```

---

## 2. HOOK DECISION ALGORITHM

```
NEED A HOOK?
│
├─ Is it for fetching/mutating data from API?
│   │
│   ├─ YES → Check src/hooks/ for existing hook
│   │   │
│   │   ├─ EXISTS → Import from '@/hooks/{hook-name}'
│   │   │
│   │   └─ NOT EXISTS → Is it reusable across routes?
│   │       │
│   │       ├─ YES → Create in src/hooks/use-{entity}-api.ts
│   │       │
│   │       └─ NO → Create in same folder @hooks/use-{feature}-api.ts
│   │
│   └─ NO → Is it form logic?
│       │
│       ├─ YES → Create in same folder @hooks/use-{feature}-form.ts
│       │
│       └─ NO → Evaluate if local state or create utility hook
```

### Global Hooks (src/hooks/)

| Hook | Purpose |
|------|---------|
| `use-enterprises-api.ts` | Enterprise CRUD & selection |
| `use-machines-api.ts` | Machine CRUD & selection |
| `use-users-api.ts` | User CRUD & selection |
| `use-roles-api.ts` | Role CRUD & selection |
| `use-customers-api.ts` | Customer CRUD & selection |
| `use-sensors-api.ts` | Sensor CRUD & selection |
| `use-auth.ts` | Auth state (Zustand) |
| `use-locale.ts` | Language state |

---

## 3. COLOCATION STRUCTURE

```
src/routes/_private/{module}/
├── index.tsx                # Main route page
│
├── {subroute}/
│   ├── @components/         # Route-specific components
│   │   └── {ComponentName}.tsx
│   │
│   ├── @consts/             # Fixed values, enums
│   │   └── {feature}.consts.ts
│   │
│   ├── @hooks/              # Route-specific hooks
│   │   ├── use-{feature}-form.ts
│   │   └── use-{feature}-api.ts
│   │
│   ├── @interface/          # Types, Interfaces, Zod schemas
│   │   ├── {feature}.types.ts
│   │   └── {feature}.schema.ts
│   │
│   └── index.tsx            # Subroute page
```

---

## 4. PAGE ANATOMY (SHELL PATTERN)

### Mandatory Structure

```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Plus, Filter } from 'lucide-react';

function PageTemplate() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t('module.title')}>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="size-4" />
            {t('filter')}
          </Button>
          <Button>
            <Plus className="size-4" />
            {t('add')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Page content here */}
      </CardContent>
    </Card>
  );
}
```

### Construction Steps

1. Wrap all content in `<Card>`
2. Add `<CardHeader>` with `title={t('key')}` prop
3. Pass action buttons as `children` to `<CardHeader>`
4. Add `<CardContent>` for main content
5. Use `<CardFooter>` for form submit buttons
6. Use `useTranslation` for any text

### Loading State Pattern

When data is being fetched, display the page shell with loading skeleton:

```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

// Inside component when isLoading:
<Card>
  <CardHeader title={t('module.title')} />
  <CardContent className="p-12">
    <Skeleton className="h-48 w-full flex items-center justify-center">
      <Spinner />
    </Skeleton>
  </CardContent>
</Card>
```

---

## 5. LEGACY COMPONENT MAPPING

### Select Components

| Legacy | New |
|--------|-----|
| `SelectEnterprise` | `EnterpriseSelect` |
| `SelectEnterpriseWithSetup` | `EnterpriseWithSetupSelect` |
| `SelectCustomer` | `CustomerSelect` |
| `SelectRole` | `RoleSelect` |
| `SelectUsers` | `UserSelect` |
| `SelectMachine` | `MachineSelect` |
| `SelectSensor` | `SensorSelect` |
| `SelectSupplier` | `SupplierSelect` |
| `SelectLanguage` | `LanguageFormSelect` |
| `SelectPart` | `PartSelect` |
| `SelectPort` | `PortSelect` |
| `SelectFleet` | `FleetSelect` |
| `SelectForm` | `FormSelect` |
| `SelectScale` | `ScaleSelect` |
| `SelectStatus` | `StatusSelect` |
| `SelectPriority` | `PrioritySelect` |
| `SelectCountry` | `CountrySelect` |

Import: `import { XSelect } from '@/components/selects'`

### Libraries

| Legacy | New |
|--------|-----|
| `@paljs/ui` | `@/components/ui/*` |
| `react-router-dom` | `@tanstack/react-router` |
| `react-toastify` | `sonner` |
| `Fetch.get/post` | `api.get/post` from `@/lib/api/client` |
| `styled-components` | Tailwind CSS |
| `window.location.search` | `useSearch` with Zod schema |

---

## 6. UI PATTERN REFERENCES

### Statistics

| Pattern | File |
|---------|------|
| Grid without borders | `src/components/stats-01.tsx` |
| Metrics with variation | `src/components/stats-03.tsx` |
| Resource usage bars | `src/components/stats-09.tsx` |

### Forms

| Pattern | File |
|---------|------|
| Advanced form layout | `src/components/form-advanced-7.tsx` |
| Form patterns | `src/components/form-patterns-3.tsx` |
| Field layouts | `src/components/field-layouts-4.tsx` |

### Empty States

| Pattern | File |
|---------|------|
| Standard empty | `src/components/empty-standard-5.tsx` |

### Tables

| Pattern | File |
|---------|------|
| Standard table | `src/components/table-standard-3.tsx` |
| Table with actions | `src/components/table-05.tsx` |

---

## 7. I18N RULES

### Always Use

```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();

  return (
    <>
      {/* Text */}
      <h1>{t('module.title')}</h1>

      {/* With variables */}
      <p>{t('welcome.message', { name: 'User' })}</p>

      {/* In attributes */}
      <Input placeholder={t('field.placeholder')} />
    </>
  );
}
```

### Translation Files

- `src/config/translations/pt.json` (default)
- `src/config/translations/en.json`
- `src/config/translations/es.json`

### Rules

1. **NEVER** hardcode text in JSX
2. **ALWAYS** add keys to all 3 translation files
3. Use dot notation for keys: `module.section.label`

### Translation Key Verification Process

Before using any translation key, **ALWAYS**:

1. **Search** in `src/config/translations/en.json` to verify the key exists:
   ```bash
   grep -n "key.name" src/config/translations/en.json
   ```

2. **If key does NOT exist**, add it, and its translation to ALL 3 files:
   - `src/config/translations/en.json` (English)
   - `src/config/translations/es.json` (Spanish)
   - `src/config/translations/pt.json` (Portuguese - default)

---

## 8. API HOOK TEMPLATE

```tsx
// src/hooks/use-{entity}-api.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Query keys
export const {entity}Keys = {
  all: ['{entity}'] as const,
  lists: () => [...{entity}Keys.all, 'list'] as const,
  detail: (id: string) => [...{entity}Keys.all, 'detail', id] as const,
};

// List query
export function use{Entity}s(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: {entity}Keys.lists(),
    queryFn: async () => {
      const response = await api.get('/{entity}/list', { params });
      return response.data;
    },
  });
}

// Detail query
export function use{Entity}(id: string) {
  return useQuery({
    queryKey: {entity}Keys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/{entity}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Mutations
export function use{Entity}Api() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Create{Entity}Data) => api.post('/{entity}', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: {entity}Keys.lists() }),
  });

  const update = useMutation({
    mutationFn: (data: Update{Entity}Data) => api.put(`/{entity}/${data.id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: {entity}Keys.all }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/{entity}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: {entity}Keys.lists() }),
  });

  return { create, update, remove };
}
```

---

## 9. FORM HOOK TEMPLATE

```tsx
// @hooks/use-{feature}-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { {feature}Schema, type {Feature}FormData } from '../@interface/{feature}.schema';
import { use{Entity}Api } from '@/hooks/use-{entity}-api';

export function use{Feature}Form(initialData?: {Feature}FormData) {
  const { create, update } = use{Entity}Api();

  const form = useForm<{Feature}FormData>({
    resolver: zodResolver({feature}Schema),
    defaultValues: initialData,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (initialData?.id) {
      await update.mutateAsync(data);
    } else {
      await create.mutateAsync(data);
    }
  });

  return {
    form,
    onSubmit,
    isPending: create.isPending || update.isPending,
  };
}
```

---

## 10. MIGRATION CHECKLIST

```
[ ] Identify legacy components (SelectX → XSelect)
[ ] Identify legacy API calls (Fetch → api)
[ ] Create route folder in src/routes/_private/
[ ] Create @interface/ with Zod schemas
[ ] Check src/hooks/ for existing API hooks
[ ] Create @hooks/ for route-specific logic
[ ] Build page using Shell Pattern (Card → CardHeader → CardContent)
[ ] Verify translation keys in pt.json, en.json, es.json, add new keys or use existing keys
[ ] Use ShadCN components from @/components/ui/
[ ] Run pnpm check and pnpm format
```
