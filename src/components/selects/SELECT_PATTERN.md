# Padrão de Arquitetura para Componentes Select

Este documento explica como construir componentes de seleção (select) seguindo o padrão estabelecido em `supplier-select.tsx`, usando os componentes base `DataSelect` e `DataMultiSelect` com integração ao TanStack Query.

---

## 📋 Visão Geral

O padrão consiste em criar componentes select que:

1. **Usam hooks do TanStack Query** para buscar dados da API.
2. **Delegam renderização** para os componentes base `DataSelect` e `DataMultiSelect`.
3. **Suportam modo único ou múltiplo** através de props discriminadas.
4. **Aplicam transformações e filtros** nos dados antes de passar para o componente base.

---

## 🏗️ Estrutura do Componente

### 1. Definição de Tipos

```typescript
interface SupplierSelectBaseProps {
  oneBlocked?: boolean;      // Auto-seleciona se houver apenas uma opção
  disabled?: boolean;         // Desabilita o select
  className?: string;         // Classes CSS adicionais
  showActivityFilter?: boolean; // Mostra filtro de atividades
}

interface SupplierSelectSingleProps extends SupplierSelectBaseProps {
  mode: "single";
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SupplierSelectMultiProps extends SupplierSelectBaseProps {
  mode: "multi";
  value?: string[];
  onChange: (value: string[]) => void;
}

type SupplierSelectProps = SupplierSelectSingleProps | SupplierSelectMultiProps;
```

> **Importante:** Use union types discriminadas com a propriedade `mode` para suportar tanto seleção única quanto múltipla. Isso garante segurança de tipos (type safety) no TypeScript.

### 2. Integração com TanStack Query

#### Hook de API (`use-suppliers-api.ts`)

```typescript
// Definição do tipo de dados
export interface Supplier {
  razao: string;
  status: string;
  atividades: string[];
}

// Query keys para gerenciamento de cache
export const suppliersKeys = {
  all: ["suppliers"] as const,
  lists: () => [...suppliersKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...suppliersKeys.lists(), filters] as const,
};

// Função de busca (fetch)
async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>("/fas/suricatta-supplier/fornecedores");
  return response.data;
}

// Hook principal
export function useSuppliers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: suppliersKeys.list(params),
    queryFn: fetchSuppliers,
  });
}

// Hook específico para selects
export function useSuppliersSelect() {
  return useSuppliers();
}
```

### 3. Implementação do Componente

```typescript
export function SupplierSelect(props: SupplierSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className, showActivityFilter = true } = props;
  
  // 1. Buscar dados usando TanStack Query
  const query = useSuppliersSelect();
  
  // 2. Estado local para filtros (opcional)
  const [activityFilter, setActivityFilter] = useState<string>();

  // 3. Aplicar filtros aos dados
  const filteredQuery: any = activityFilter
    ? {
        ...query,
        data: query.data?.filter((s) => s.atividades?.includes(activityFilter)),
      }
    : query;

  // 4. Renderizar componente base apropriado
  if (mode === "multi") {
    return (
      <DataMultiSelect<Supplier>
        label="Fornecedor"
        placeholder="Selecione os fornecedores..."
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={filteredQuery}
        valueKey="razao"
        labelKey="razao"
        disabled={disabled}
        searchPlaceholder="Buscar fornecedor..."
        noOptionsMessage="Nenhum fornecedor disponível."
        noResultsMessage="Nenhum fornecedor encontrado."
      />
    );
  }

  return (
    <DataSelect<Supplier>
      label="Fornecedor"
      placeholder="Selecione um fornecedor..."
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={filteredQuery}
      valueKey="razao"
      labelKey="razao"
      oneBlocked={oneBlocked}
      disabled={disabled}
      clearable={false}
      searchPlaceholder="Buscar fornecedor..."
      noOptionsMessage="Nenhum fornecedor disponível."
      noResultsMessage="Nenhum fornecedor encontrado."
    />
  );
}
```

---

## � Dados Estáticos e Fixos

Para componentes que utilizam dados fixos (opções que não vêm da API), seguimos estas regras:

1. **Centralização**: Os dados devem ser obrigatoriamente armazenados em [`src/lib/constants/select-options.ts`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/lib/constants/select-options.ts). Nunca duplique ou sobrescreva valores existentes.
2. **Encapsulamento**: A lógica de simulação de query e a internacionalização das labels devem residir dentro do componente especializado em `src/components/selects`.
3. **Simulação de Query**: Para manter a compatibilidade com `DataSelect`, simulamos o objeto de retorno do TanStack Query usando `UseQueryResult`.
4. **Tradução (i18n)**: Utilize o hook `useIntl()` dentro do componente e a prop `mapToOptions` para traduzir as chaves de label (`labelKey`) no momento da renderização.

### Exemplo de Constante (`select-options.ts`)

```typescript
export interface PriorityOption {
  value: string;
  labelKey: string; // Chave para tradução
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: "low", labelKey: "priority.low" },
  { value: "medium", labelKey: "priority.medium" },
  { value: "high", labelKey: "priority.high" },
];
```

### Exemplo de Componente Estático Traduzido

```tsx
import { useIntl } from 'react-intl';
import { DataSelect } from '@/components/ui/data-select';
import { PRIORITY_OPTIONS, type PriorityOption } from '@/lib/constants/select-options';

export function PrioritySelect(props: PrioritySelectProps) {
  const intl = useIntl();

  // Simulação de query para compatibilidade
  const query = {
    data: PRIORITY_OPTIONS,
    isLoading: false,
    isSuccess: true,
    status: "success",
  } as UseQueryResult<PriorityOption[], Error>;

  return (
    <DataSelect<PriorityOption>
      label={props.label || intl.formatMessage({ id: 'priority' })}
      query={query}
      mapToOptions={(data) => data.map(opt => ({
        value: opt.value,
        label: intl.formatMessage({ id: opt.labelKey }),
        data: opt
      }))}
      {...props}
    />
  );
}
```

### Exemplo de Componente Estático

```typescript
export function PrioritySelect(props: PrioritySelectProps) {
  const { mode, disabled, className, label } = props;

  // 1. Simular objeto de query
  const query = {
    data: PRIORITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: "success" as const,
  };

  // 2. Mapeamento (opcional se valueKey/labelKey forem padrão)
  const mapToOptions = (data: PriorityOption[]) => data.map(opt => ({
    value: opt.value,
    label: opt.label,
    data: opt
  }));

  return (
    <DataSelect<PriorityOption>
      label={label || "Prioridade"}
      query={query as any} // Cast necessário para simulação
      mapToOptions={mapToOptions}
      {...props}
    />
  );
}
```

---

## �🔑 Props dos Componentes Base

### DataSelect Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string?` | Rótulo do campo |
| `placeholder` | `string?` | Texto quando nenhum valor selecionado |
| `value` | `string \| number?` | Valor selecionado |
| `onChange` | `function` | Callback quando a seleção muda |
| `query` | `UseQueryResult<T[], Error>` | **Resultado do TanStack Query** |
| `mapToOptions` | `function?` | Função para mapear dados para opções |
| `valueKey` | `string?` | Chave do objeto para usar como valor (padrão: 'id') |
| `labelKey` | `string?` | Chave do objeto para usar como label (padrão: 'name') |
| `oneBlocked` | `boolean?` | Seleciona automaticamente se houver apenas uma opção |
| `disabled` | `boolean?` | Desabilita o select |
| `clearable` | `boolean?` | Permite limpar a seleção |
| `searchPlaceholder` | `string?` | Placeholder da busca |
| `noOptionsMessage` | `string?` | Mensagem quando não há opções |
| `noResultsMessage` | `string?` | Mensagem quando a busca não retorna resultados |

### DataMultiSelect Props

Similar ao `DataSelect`, mas:
- `value` é `(string | number)[]?`
- `onChange` recebe `(values, options) => void`
- Adiciona `maxShownItems` para limitar badges mostradas.

---

## 🎯 Padrão de Filtros (Opcional)

O `SupplierSelect` demonstra como adicionar filtros locais:

```typescript
// 1. Estado do filtro
const [activityFilter, setActivityFilter] = useState<string>();

// 2. Extrair valores únicos para o filtro
const activities = query.data
  ?.flatMap((s) => s.atividades || [])
  .filter((v, i, a) => a.indexOf(v) === i) 
  || [];

// 3. Criar query mock para o filtro
const activitiesQuery: any = {
  data: activities,
  isLoading: false,
  isError: false,
  error: null,
  status: "success",
};

// 4. Renderizar select de filtro
<DataSelect<string>
  label="Filtrar pela atividade (Opcional)"
  placeholder="Selecione uma atividade..."
  value={activityFilter}
  onChange={(val) => setActivityFilter(val as string)}
  query={activitiesQuery}
  mapToOptions={(acts) => acts.map((a) => ({ value: a, label: a }))}
  clearable
  className="mb-4"
/>
```

---

## 📝 Como Converter Outros Componentes

### Passo 1: Criar ou Verificar o Hook de API

```typescript
// src/hooks/use-[entidade]-api.ts
export interface MinhaEntidade {
  id: string;
  nome: string;
}

export const minhaEntidadeKeys = {
  all: ["minhaEntidade"] as const,
  lists: () => [...minhaEntidadeKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...minhaEntidadeKeys.lists(), filters] as const,
};

async function fetchMinhaEntidade(): Promise<MinhaEntidade[]> {
  const response = await api.get<MinhaEntidade[]>("/api/endpoint");
  return response.data;
}

export function useMinhaEntidade(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: minhaEntidadeKeys.list(params),
    queryFn: fetchMinhaEntidade,
  });
}

export function useMinhaEntidadeSelect() {
  return useMinhaEntidade();
}
```

### Passo 2: Definir Interface de Props

```typescript
// src/components/selects/minha-entidade-select.tsx
interface MinhaEntidadeSelectBaseProps {
  oneBlocked?: boolean;
  disabled?: boolean;
  className?: string;
}

interface MinhaEntidadeSelectSingleProps extends MinhaEntidadeSelectBaseProps {
  mode: "single";
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MinhaEntidadeSelectMultiProps extends MinhaEntidadeSelectBaseProps {
  mode: "multi";
  value?: string[];
  onChange: (value: string[]) => void;
}

type MinhaEntidadeSelectProps = MinhaEntidadeSelectSingleProps | MinhaEntidadeSelectMultiProps;
```

### Passo 3: Implementar o Componente

```typescript
export function MinhaEntidadeSelect(props: MinhaEntidadeSelectProps) {
  const { mode, oneBlocked = false, disabled = false, className } = props;
  const query = useMinhaEntidadeSelect();

  if (mode === "multi") {
    return (
      <DataMultiSelect<MinhaEntidade>
        label="Minha Entidade"
        placeholder="Selecione..."
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        valueKey="id"      // Ajustar conforme sua entidade
        labelKey="nome"    // Ajustar conforme sua entidade
        disabled={disabled}
        className={className}
      />
    );
  }

  return (
    <DataSelect<MinhaEntidade>
      label="Minha Entidade"
      placeholder="Selecione..."
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      valueKey="id"
      labelKey="nome"
      oneBlocked={oneBlocked}
      disabled={disabled}
      className={className}
    />
  );
}
```

---

## ✅ Checklist de Conversão

- [ ] Hook de API criado ou verificado em `src/hooks/use-[entidade]-api.ts`.
- [ ] Interface de tipo exportada do hook.
- [ ] Query keys definidas para gerenciamento de cache.
- [ ] Hook `use[Entidade]Select()` criado.
- [ ] Props discriminadas definidas (single/multi).
- [ ] Componente usa `DataSelect` ou `DataMultiSelect`.
- [ ] Props `valueKey` e `labelKey` configuradas corretamente.
- [ ] Mensagens em português configuradas.
- [ ] Componente exportado em `src/components/selects/index.ts`.
- [ ] Type safety verificado (sem `any` desnecessários).
