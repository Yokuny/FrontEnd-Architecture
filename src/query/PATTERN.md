# Query File Pattern

Cada arquivo `src/query/{feature}.ts` segue esta estrutura, nesta ordem:

```
1. Imports
2. Types locais (se necessario)
3. Query Keys
4. Fetch functions (privadas)
5. Query Hooks
6. Mutation Hooks (se houver)
7. Cache Helpers (se necessario)
8. Utilitarios puros (mappers, getters)
```

## Query Keys

Objeto hierarquico com `as const` em cada nivel:

```ts
// Lista + Detalhe
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: (params?) => [...featureKeys.lists(), params] as const,
  details: () => [...featureKeys.all, 'detail'] as const,
  detail: (id: string) => [...featureKeys.details(), id] as const,
};

// Somente lista (sem detalhe)
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: () => [...featureKeys.lists()] as const,
};

// Somente detalhe (singleton como clinic, user)
export const featureKeys = {
  all: ['feature'] as const,
  detail: () => [...featureKeys.all, 'detail'] as const,
};
```

## Fetch Functions

Funcoes `async` privadas. Usam `request()` + `GET()`/`POST()`/etc de `@/lib/api/client`:

```ts
async function fetchFeatures(): Promise<Feature[]> {
  const res = await request('feature/list', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as Feature[];
}

async function fetchFeature(id: string): Promise<FullFeature> {
  const res = await request(`feature/${id}`, GET());
  if (!res.success) throw new Error(res.message);
  return res.data as FullFeature;
}
```

## Query Hooks

- Listagem: `use{Feature}sQuery()` ou `use{Feature}Query()`
- Detalhe: `use{Feature}DetailQuery(id?)` com `enabled: !!id`
- Com params: passar parametros ao `queryFn` via closure

```ts
export function useFeaturesQuery() {
  return useQuery({
    queryKey: featureKeys.list(),
    queryFn: fetchFeatures,
  });
}

export function useFeatureDetailQuery(id?: string) {
  return useQuery({
    queryKey: featureKeys.detail(id ?? ''),
    queryFn: () => fetchFeature(id!),
    enabled: !!id,
  });
}
```

## Mutation Hooks

Agrupadas num unico hook `use{Feature}Mutations()`:

```ts
export function useFeatureMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.lists() });
    },
  });

  return { create };
}
```

## Utilitarios Puros

Funcoes que recebem dados como argumento (nao chamam hooks):

```ts
export function mapFeaturesToCombobox(features: Feature[] | undefined) {
  if (!features?.length) return [];
  return features.map((f) => valueAndLabel(f._id, f.name));
}
```
