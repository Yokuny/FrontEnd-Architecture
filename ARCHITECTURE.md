# Padrões e Arquitetura do Projeto

**DentalEase** — Sistema de gestão de clínica odontológica.
Monorepo com front-end aqui e back-end em [`../DentalEase/DentalEase-BackEnd/`](../DentalEase/DentalEase-BackEnd/).

## Stack

- **Core**: React 19, Vite 7, TypeScript 5
- **Roteamento**: TanStack Router 1 (file-based, baseado em diretórios)
- **Server State**: TanStack Query 5 (cache, loading, error, refetch)
- **Client State**: Zustand 5 (persist middleware para UI e preferências)
- **UI**: ShadCN UI + Radix UI — localizado em [`src/components/ui`](./src/components/ui)
- **Estilização**: Tailwind CSS 4
- **Formulários**: react-hook-form 7 + Zod 3
- **Gráficos**: Recharts 2
- **Formatação**: Biome 2

---

## UI & Estilização

### ShadCN Sempre, HTML Nunca

- **Proibido** tags HTML puras estilizadas (`<div className="font-bold">`, `<p>`, `<h1>`, `<span>` com estilos)
- Para texto use [`<ItemTitle>`](./src/components/ui/item.tsx) e [`<ItemDescription>`](./src/components/ui/item.tsx)
- Para alinhar/agrupar use `<Item>`, `<ItemGroup>`, `<ItemContent>` de [`item.tsx`](./src/components/ui/item.tsx)
- Para botões, inputs, labels — tudo de `@/components/ui/`
- Ícones customizados em [`src/components/icons/`](./src/components/icons/) (94 ícones SVG)

### Páginas vs Componentes Comuns

| Contexto | Componente Base | Regra |
|----------|----------------|-------|
| **Páginas** (usa `createFileRoute`) | `Card`, `CardHeader`, `CardContent`, `CardFooter` | Obrigatório em toda rota |
| **Componentes comuns** | `Item`, `ItemGroup`, `ItemContent`, `ItemTitle`, `ItemDescription` | Nunca usar `Card` |

### Componentes Obrigatórios

| Situação | Componente | Localização |
|----------|-----------|-------------|
| Loading/requisição pendente | [`<DefaultLoading />`](./src/components/default-loading.tsx) | `@/components/default-loading` |
| Dados vazios/busca sem resultado | [`<DefaultEmptyData />`](./src/components/default-empty-data.tsx) | `@/components/default-empty-data` |
| Formulários (criar/editar) | [`<DefaultFormLayout />`](./src/components/default-form-layout.tsx) | `@/components/default-form-layout` |
| Exibição de KPIs | [`<DefaultKPI />`](./src/components/default-KPI.tsx) | `@/components/default-KPI` |

### Listagens — DataTable Obrigatório

Toda listagem de registros usa [`<DataTable>`](./src/components/ui/data-table.tsx) — **nunca** `ItemGroup`/`Item` para listas de dados.

```tsx
// Colunas SEMPRE com useMemo e tipagem correta
const columns = useMemo<DataTableColumn<PartialPatient>[]>(() => [
  {
    key: 'name',
    header: 'Paciente',
    sortable: true,
    render: (_, item) => <span>{item.name}</span>,
  },
], []);

// Quando paginação/busca é controlada externamente via URL:
<DataTable data={items} columns={columns} searchable={false} showPagination={false} />
```

---

## Roteamento

As rotas são baseadas em **diretórios**. Cada pasta de rota deve conter obrigatoriamente um `index.tsx`. Isso garante a integridade do Breadcrumb e da Sidebar.

### Regras

| Arquivo | Rota Gerada | Regra |
|---------|-------------|-------|
| `index.tsx` | `/` | Página raiz do diretório |
| `add/index.tsx` | `/add` | Formulário de criação (diretório) |
| `details.tsx` | `/details?id=...` | Detalhe via search params |
| `edit.$id.tsx` | — | **PROIBIDO** — não usar `.` em nomes de arquivo |
| `$id/index.tsx` | — | **PROIBIDO** — não usar parâmetros dinâmicos (quebra breadcrumb) |
| `add.tsx` | — | **PROIBIDO** — rotas devem ser diretórios com `index.tsx` |

### Definição de Rota

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(20),
  search: z.string().optional(),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/patient/')({
  component: PatientListPage,
  staticData: {
    title: 'Pacientes',
    description: 'Gestão e listagem de pacientes cadastrados na clínica',
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});
```

### Estrutura de Página

```tsx
<Card asPage>
  <CardHeader>
    <CardAction>
      <div className="flex items-center gap-2">
        <Input placeholder="Buscar" />
        <Button onClick={() => navigate({ to: '/patient/add' })}>
          <Add className="size-4" />
          Adicionar
        </Button>
      </div>
    </CardAction>
  </CardHeader>

  <CardContent>
    {isLoading ? (
      <DefaultLoading />
    ) : items.length === 0 ? (
      <DefaultEmptyData />
    ) : (
      <DataTable data={items} columns={columns} searchable={false} showPagination={false} />
    )}
  </CardContent>

  <CardFooter layout="multi">
    {/* Paginação */}
  </CardFooter>
</Card>
```

- `Card asPage` ativa Breadcrumb automático
- `CardHeader` extrai título e descrição do `staticData` da rota automaticamente

---

## Organização de Rotas e Pastas

As subpastas `@hooks`, `@interface`, `@components`, `@consts` e `@utils` são criadas na pasta da rota:

| Pasta | Conteúdo | Quando Usar |
|-------|----------|-------------|
| `@components/` | Componentes React | Elementos visuais exclusivos desta rota |
| `@consts/` | Arrays, objetos, enums | Valores fixos ou que não mudam em runtime |
| `@hooks/` | Hooks de API e formulário | Lógica de forms (useForm) ou queries/mutations específicas |
| `@interface/` | Types, Interfaces, Schemas Zod | Tipagens e schemas de validação |
| `@utils/` | Funções puras e auxiliares | Processamento de dados sem dependência de hooks |

```
src/routes/_private/{module}/
├── index.tsx                # Página principal (listagem)
├── add/
│   └── index.tsx            # Formulário criar/editar
├── details.tsx              # Detalhe (ID via search params)
├── @components/
│   └── {feature}-form.tsx
├── @consts/
│   └── {feature}.consts.ts
├── @hooks/
│   ├── use-{feature}-form.ts
│   └── use-{feature}-api.ts
├── @interface/
│   ├── {feature}.interface.ts
│   └── {feature}.schema.ts
└── @utils/
    └── columns.tsx
```

---

## Tradução

Todos os textos do sistema devem ter sua chave em [`src/config/translations.json`](./src/config/translations.json) e ser traduzidos via [`t()`](./src/lib/helpers/translate.ts):

```tsx
import { t } from '@/lib/helpers/translate';

t('pending')   // → "Pendente"
t('patient')   // → "Pacientes"
t('unknown')   // → "unknown" (fallback: retorna a própria chave)
```

---

## Formatação de Datas

Toda formatação de data deve usar [`formatDate()`](./src/lib/helpers/formatDate.utils.ts). **Nunca** importar `format` diretamente do `date-fns`.

```tsx
import { formatDate, formatDistanceToNow } from '@/lib/helpers/formatDate.utils';

formatDate(new Date())                    // "01 jan 2026" (default: dd MMM yyyy)
formatDate(new Date(), 'PP')              // "1 de jan. de 2026"
formatDate(null, 'dd MMM yyyy', '-')      // "-"
formatDistanceToNow(date)                 // "há 2 horas"
```

---

## Gerenciamento de Estado

### Quando Usar Cada Tipo

| Tipo | Ferramenta | Exemplo |
|------|------------|---------|
| Server State | TanStack Query | Lista de pacientes, detalhes, dados da clínica |
| Form State | react-hook-form | Campos de formulário |
| UI Local | useState | Modal aberto, tab ativa |
| UI Global | Zustand | Sidebar, tema, filtro global, utilitários |
| Persistente | Zustand + persist | Token de auth, preferências de UI |

### Regra Fundamental

**TanStack Query é o dono da verdade para dados da API.** Zustand guarda apenas estado de UI e utilitários puros — nunca dados de servidor.

- **Proibido** `localStorage.setItem` diretamente — usar Zustand com `persist`
- **Proibido** sincronizar TanStack Query → Zustand via `useEffect`
- **Proibido** `fetch` em `useEffect` — usar TanStack Query

```tsx
// CORRETO: Zustand para UI persistente
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      selectedRoom: '',
      setSelectedRoom: (room) => set({ selectedRoom: room }),
    }),
    { name: 'user-ui' },
  ),
);
```

---

## Hook de API (TanStack Query)

Queries ficam centralizadas em [`src/query/{feature}.ts`](./src/query/). Consulte [`src/query/PATTERN.md`](./src/query/PATTERN.md) para referência rápida.

```tsx
// src/query/patients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GET, POST, PUT, DELETE, request } from '@/lib/api/client';

// 1. Query keys hierárquicas
export const patientsKeys = {
  all: ['patients'] as const,
  lists: () => [...patientsKeys.all, 'list'] as const,
  list: () => [...patientsKeys.lists()] as const,
  partials: () => [...patientsKeys.all, 'partial'] as const,
  partial: () => [...patientsKeys.partials()] as const,
  details: () => [...patientsKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientsKeys.details(), id] as const,
};

// 2. Fetch functions (privadas)
async function fetchPatients(): Promise<PartialPatient[]> {
  const res = await request('patient', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialPatient[];
}

// 3. Query Hooks
export function usePatientsQuery() {
  return useQuery({
    queryKey: patientsKeys.list(),
    queryFn: fetchPatients,
  });
}

export function usePatientDetailQuery(id?: string) {
  return useQuery({
    queryKey: patientsKeys.detail(id ?? ''),
    queryFn: () => fetchPatient(id!),
    enabled: !!id,
  });
}

// 4. Mutation Hooks (agrupadas)
export function usePatientMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: NewPatient) => request('patient', POST(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientsKeys.partials() });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewPatient }) =>
      request(`patient/${id}`, PUT(data)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: patientsKeys.detail(variables.id) });
    },
  });

  return { create, update };
}
```

---

## Hook de Formulário (react-hook-form + Zod)

```tsx
// @hooks/use-patient-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type NewPatient, patientSchema } from '../@interface/patient.interface';

export function usePatientForm(initialData?: Partial<NewPatient> & { id?: string }) {
  const { create, update } = usePatientMutations();

  const form = useForm<NewPatient>({
    resolver: zodResolver(patientSchema),
    values: initialData as NewPatient,
    defaultValues: { name: '', email: undefined },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (initialData?.id) {
      await update.mutateAsync({ id: initialData.id, data });
    } else {
      await create.mutateAsync(data);
    }
  });

  return { form, onSubmit, isPending: create.isPending || update.isPending };
}
```

### Componente de Formulário

```tsx
// @components/patient-form.tsx
import { useFormContext } from 'react-hook-form';
import DefaultFormLayout from '@/components/default-form-layout';

export function PatientForm() {
  const form = useFormContext<NewPatient>();

  const sections = [
    {
      title: 'Informações Pessoais',
      description: 'Dados principais do paciente',
      fields: [
        <div key="row-1" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="sex" render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
```

---

## Criação e Reutilização de Hooks

**Antes de criar qualquer hook** na pasta `@hooks/` da rota, verifique se já existe:

```
Preciso de um hook para listar pacientes?
  └─ Já existe em src/query/patients.ts?
      ├─ SIM → import { usePatientsQuery } from '@/query/patients'
      └─ NÃO → Criar em src/query/patients.ts (reutilizável)

Preciso de um hook para o formulário de paciente?
  └─ É específico da rota de edição?
      ├─ SIM → Criar em @hooks/use-patient-form.ts
      └─ NÃO → Avaliar se deve ir em src/hooks/
```

### Hooks Globais ([`src/hooks/`](./src/hooks/))

| Hook | Descrição |
|------|-----------|
| `useAuth` | Sessão, login, logout, token (persist) |
| `usePatientStore` | getName, getImage, mapToCombobox |
| `useProfessionalStore` | Lookup de profissionais |
| `useProfessionalColors` | Cores persistentes por profissional |
| `useFinancialStore` | mapToCombobox financeiros |
| `useOdontogramStore` | mapToCombobox odontogramas |
| `useClinicStore` | getRoomName |
| `useUserStore` | Sala selecionada (persist) |
| `useFavorites` | Favoritos persistentes |
| `useIsMobile` | Detecta dispositivo mobile |
| `useSidebar` | Estado da sidebar |
| `useCurrentTimeIndicator` | Posição do indicador de hora no calendário |
| `useEventVisibility` | Eventos visíveis no calendário |

### Query Hooks ([`src/query/`](./src/query/))

| Arquivo | Hooks Principais |
|---------|-----------------|
| `patients.ts` | `usePatientsQuery`, `usePatientDetailQuery`, `usePatientMutations` |
| `financials.ts` | `useFinancialsQuery`, `useFinancialDetailQuery`, `useFinancialMutations` |
| `schedules.ts` | `useSchedulesQuery`, `useScheduleDetailQuery`, `useScheduleMutations` |
| `odontogram.ts` | `useOdontogramQuery`, `useOdontogramMutations` |
| `clinic.ts` | `useClinicApi`, `useClinicCache` |
| `user.ts` | `useUserQuery` |
| `procedures.ts` | `useProceduresQuery` |
| `reminders.ts` | `useRemindersQuery`, `useReminderMutations` |

---

## Data-Inputs — Selects e Comboboxes Globais

[`src/components/data-inputs/`](./src/components/data-inputs/) — **8 componentes disponíveis**

Já encapsulam estado, loading, busca e erro. Verifique antes de criar um novo.

| Componente | Descrição |
|-----------|-----------|
| `PatientCombobox` | Seleção de paciente com avatar e busca |
| `ProfessionalCombobox` | Seleção de dentista/profissional com avatar |
| `FinancialCombobox` | Seleção financeira filtrada por paciente |
| `OdontogramCombobox` | Seleção de odontograma filtrada por paciente |
| `ProcedureComponent` | Lista editável de procedimentos (useFieldArray) |
| `ProceduresSheet` | Sheet lateral para selecionar procedimentos |
| `DatePickerButton` | Botão com popover de calendário |
| `DateTimePicker` | Seletor de data/hora com dia inteiro e intervalos de 15min |

**Props padrão dos comboboxes:** `controller` (react-hook-form), `disabled?`, `fetchFn` (async → `{ value, label }[]`)

---

## Gráficos (Recharts)

### Regras

- **Sempre** usar [`getChartColor(index)`](./src/components/ui/chart.tsx) para cores — nunca hardcoded
- **Nunca** usar `mx-auto` no `ChartContainer` (quebra `ResponsiveContainer`)
- Gráficos ficam em componentes comuns → usar `Item`/`ItemContent` — **nunca** `Card`
- Modelos em `src/components/graph-*.tsx` são **referência** — não importar diretamente

### Cores

A função cicla entre 17 cores do Tailwind incrementando o tom a cada ciclo:
- `index 0-16` → tom 400 (sky-400, blue-400, ..., cyan-400)
- `index 17-33` → tom 500
- Use `index * 2` ou `index * 3` para maior contraste entre cores

### Modelos de Referência

| Modelo | Tipo | Arquivo |
|--------|------|---------|
| Área | `AreaChart` + gradiente | [`graph-area.tsx`](./src/components/graph-area.tsx) |
| Barras Empilhadas | `BarChart` + `stackId` | [`graph-bar-stacked.tsx`](./src/components/graph-bar-stacked.tsx) |
| Barras Horizontais | `BarChart` + `layout="vertical"` | [`graph-bar-horizontal.tsx`](./src/components/graph-bar-horizontal.tsx) |
| Linhas | `LineChart` | [`graph-lines.tsx`](./src/components/graph-lines.tsx) |
| Pizza/Donut | `PieChart` + `innerRadius` | [`graph-pizza.tsx`](./src/components/graph-pizza.tsx) |
| Radial | `RadialBarChart` | [`graph-radial.tsx`](./src/components/graph-radial.tsx) |
| Breakdown | Barra segmentada customizada | [`graph-break-parts.tsx`](./src/components/graph-break-parts.tsx) |
| Progresso | `Progress` do ShadCN | [`graph-progress.tsx`](./src/components/graph-progress.tsx) |
| KPIs | Números e indicadores | [`default-KPI.tsx`](./src/components/default-KPI.tsx) |

Consulte [`docs/charts.md`](./docs/charts.md) para exemplos detalhados de cada tipo.

---

## API Client

[`src/lib/api/client.ts`](./src/lib/api/client.ts) — Wrapper de fetch com autenticação automática.

```tsx
import { GET, POST, PUT, PATCH, DELETE, request } from '@/lib/api/client';

const res = await request('patient', GET());          // { success, data, message }
const res = await request('patient', POST(body));
const res = await request(`patient/${id}`, PUT(body));
const res = await request(`patient/${id}`, DELETE());
```

- Auth automático via token do Zustand store (`Authorization: Ease ${token}`)
- Base URL: `import.meta.env.VITE_CORE_URL`
- `requestWithoutToken()` para endpoints públicos

---

## Back-End (Referência)

O back-end fica em [`../DentalEase/DentalEase-BackEnd/`](../DentalEase/DentalEase-BackEnd/). Node.js + Express + MongoDB + Mongoose + Zod.

### Rotas Disponíveis

| Prefixo | Módulo |
|---------|--------|
| `/auth` | Autenticação (signup, signin, logout, refresh) |
| `/patient` | Pacientes (CRUD + odontogram + image) |
| `/schedule` | Agendamentos (CRUD + status + time) |
| `/financial` | Financeiro (CRUD + status) |
| `/odontogram` | Odontogramas |
| `/clinic` | Configurações da clínica |
| `/user` | Gestão de usuários |
| `/procedure` | Catálogo de procedimentos |
| `/reminder` | Lembretes |
| `/s3` | Upload de arquivos |

### Padrão CRUD

```
GET    /{module}           → Lista todos
GET    /{module}/partial    → Lista resumida (para selects — ID + campos mínimos)
GET    /{module}/:id        → Detalhe completo
POST   /{module}            → Criar
PUT    /{module}/:id        → Atualizar
PATCH  /{module}/:id/status → Atualizar status
DELETE /{module}/:id        → Deletar (admin only)
```

As rotas `/partial` retornam dados resumidos para preencher comboboxes e selects, trazendo o ID para busca completa quando o usuário seleciona.

### Arquitetura em Camadas

```
Request → Router → Middleware (Zod) → Controller → Service → Repository → MongoDB
```

Consulte [`docs/backend-reference.md`](./docs/backend-reference.md) para detalhes completos.

---

## Padrões React

### Declaração de Componentes

**Sempre** `function` declarations — nunca `const Component = () =>`:

```tsx
// CORRETO
function PatientCard({ patient }: PatientCardProps) {
  return (
    <Item>
      <ItemTitle>{patient.name}</ItemTitle>
      <ItemDescription>{patient.email}</ItemDescription>
    </Item>
  );
}
```

### Ordem Interna do Componente

```tsx
function MyComponent({ prop }: MyComponentProps) {
  // 1. Hooks de contexto/router
  const navigate = Route.useNavigate();
  // 2. Zustand
  const { selectedRoom } = useUserStore();
  // 3. TanStack Query
  const { data, isLoading } = usePatientsQuery();
  // 4. Estado local
  const [isOpen, setIsOpen] = useState(false);
  // 5. useMemo
  const filtered = useMemo(() => data?.filter(p => p.active), [data]);
  // 6. useCallback
  const handleSelect = useCallback((p: Patient) => { ... }, []);
  // 7. useEffect (com moderação)
  // 8. Early returns: loading → error → empty → conteúdo
  if (isLoading) return <DefaultLoading />;
  if (!data?.length) return <DefaultEmptyData />;
  // 9. Render
  return ( ... );
}
```

### Anti-Patterns

- `localStorage.setItem` → usar Zustand `persist`
- `useEffect(() => setTotal(...), [items])` → usar `useMemo`
- `useEffect(() => fetch(...), [])` → usar TanStack Query
- Props drilling → usar Zustand ou Context
- `const Component = () =>` → usar `function` declaration

---

## Ferramentas de Produtividade

**Biome** para formatação e linting. **TypeScript** para type-checking.

```bash
pnpm run format  # Biome (antes de commitar)
pnpm run check   # TypeScript (antes de commitar)
```

**Tailwind CSS IntelliSense** — `Ctrl + Espaço` (Windows) ou `Cmd + Espaço` (Mac) dentro de `className=""`.
