# Arquitetura do Projeto

> Esta é a nova arquitetura do front-end utilizando **TanStack Router**, **Zustand**, **TanStack Query** e **ShadCN UI**

---

### REGRA CRÍTICA: Estrutura e Padrão de uma Rota

> **Importante**: As página e roteamento deve ser feito por **pasta**, e cada pasta de rota deve ter um arquivo `index.tsx` que irá conter a estrutura principal da página; não usar o caracter `.` para criar rotas alinhadas, isso irá quebrar a navegação via Breadcrumb e a navegação na Sidebar.

### REGRA: Criação e uso de Hooks

> **Importante**: Antes de criar qualquer hook de API ou estado global em `@hooks/`, verifique se já existe em [`src/hooks/`](./src/hooks/). A logica de criação está exemplificada abaixo:

Preciso de useMachines() para listar máquinas?
  └─ Já existe em src/hooks/use-machines-api.ts? 
       ├─ SIM → import { useMachines } from '@/hooks/use-machines-api'
       └─ NÃO → Criar em src/hooks/use-machines-api.ts (reutilizável)

Preciso de useMachineForm() para gerenciar formulário de máquina?
  └─ É específico da rota de edição de máquina?
       ├─ SIM → Criar em @hooks/use-machine-form.ts
       └─ NÃO → Avaliar se deve ir em src/hooks/


| Hook comuns | Descrição |
|-------------|-----------|
| `use-enterprises-api.ts` | Hook comun para buscar idEnterprise da empresa do usuário logado |
| `use-machines-api.ts` | Hook comun para buscar valores de máquinas e embarcações |
| `use-users-not-in-role.ts` | Hook comun para buscar usuários que não estão em um determinado perfil |
| `use-roles-api.ts` | Hook comun para buscar as permissões do usuário logado |

### REGRA OBRIGATÓRIA: Pastas de rotas e organização de arquivos

> **Importante**: As subpastas `@hooks`, `@interface`, `@components` e `@consts` devem ser criadas na pasta da rota; Hooks e estados globais devem ser criados em `src/hooks/`. De resto segue a tabela de uso abaixo:

| Pasta | Conteúdo | Quando Usar |
|-------|----------|-------------|
| `@components/` | Componentes React visuais | Componente usado APENAS nesta rota |
| `@consts/` | Arrays, objetos, enums fixos | Valores que não mudam em runtime |
| `@hooks/` | Hooks de API e lógica de formulário | Requisições específicas da rota |
| `@interface/` | Types, Interfaces, Schemas Zod | Tipagens específicas da rota |

```
src/routes/_private/embarcacoes/
├── index.tsx                  # < pagina inicial de embarcacoes
│
├── cadastro/                  # < subrota de cadastro de embarcacoes
│   ├── @components/           # < componentes visuais EXCLUSIVOS desta página
│   │   ├── FormularioDadosNavio.tsx
│   │   └── TabelaEquipamentos.tsx
│   ├── @consts/               # < constantes e valores fixos usados nesta rota
│   │   └── tiposEmbarcacao.ts
│   ├── @hooks/                # < hooks de api e logica local
│   │   ├── useCadastroNavioQuery.ts
│   │   └── useCadastroNavioMutation.ts
│   ├── @interface/            # < types, interfaces e schemas zod usados nesta rota
│   │   ├── embarcacao.types.ts
│   │   └── embarcacao.schema.ts
│   └── index.tsx              # < arquivo de contrução visual da rota
│
└── manutencoes/               # < pagina de manutençoes
    ├── @components/
    ├── @hooks/
    ├── @interface/
    ├── index.tsx              # < arquivo da rota principal
    └── historico/             # < subrota
        ├── @components/
        ├── @hooks/
        ├── @interface/
        └── index.tsx          # < arquivo de contrução visual da subrota
```
### REGRA OBRIGATÓRIA: Usar os componentes ShadCN UI presentes em [`src/components/ui`](./src/components/ui)

> **Padrão de criação de pagina**:
  1. [`Card`](./src/components/ui/card.tsx): **OBRIGATÓRIO** para iniciar e envolver qualquer página (Shell/Wrapper de página). Use para construir a estrutura principal e inicial da página.

  2. [`CardHeader`](./src/components/ui/card.tsx): **OBRIGATÓRIO** O componente `CardHeader` é o cabeçalho oficial de todas as páginas dentro do aplicativo ([páginas autenticadas](./src/routes/_private)).

  Exemplo de uso:
  ```tsx
  import { Filter, Plus } from 'lucide-react';
  import { Card, CardContent, CardHeader } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';

  export function MinhaPagina() {
    const { t } = useTranslation();

    return (
      <Card>
        <CardHeader title={t('meu.modulo.titulo')}>
          {/* As ações passam como children e ficam à direita */}
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="size-4" />
              {t('filter')}
            </Button>
            <Button onClick={() => navigate({ to: '/add' })}>
              <Plus className="size-4" />
              {t('btn.novo')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Conteúdo da página */}
        </CardContent>
      </Card>
    );
  }
  ```

  **Padrão de Loading de Página**:
  
  Quando os dados estão sendo carregados, exiba o shell da página com skeleton:

  ```tsx
  import { Card, CardContent, CardHeader } from '@/components/ui/card';
  import { Skeleton } from '@/components/ui/skeleton';
  import { Spinner } from '@/components/ui/spinner';

  // Quando isLoading:
  <Card>
    <CardHeader title={t('edit.user')} />
    <CardContent className="p-12">
      <Skeleton className="h-48 w-full flex items-center justify-center">
        <Spinner />
      </Skeleton>
    </CardContent>
  </Card>
  ```

  3. [`Select`](./src/components/selects/index.ts): Busque os seletores no diretório `@/components/selects`, como está é uma nova arquitetura os nomes podem variar, as operaçoes desses seletores estão presentes em [`@/hooks/`](./src/hooks/).

  Exemplo de conversão da antiga nomeclatura para a nova:
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
  
  4. [`Item`](./src/components/ui/item.tsx): Use para criar **cards informativos**, listagens de dados, cartões de entidade ou estatísticas.
  Toda página começa com um `Card`. Se dentro dela você precisar exibir dados repetíveis ou blocos de informação (como métricas), use o componente [`Item`](./src/components/ui/item.tsx).
  
  Exemplos com padrão do sistema:
  - [`stats-01.tsx`](./src/components/stats-01.tsx) - Grid de estatísticas sem bordas internas.
  - [`stats-03.tsx`](./src/components/stats-03.tsx) - Cards de métricas com indicadores de variação.
  - [`stats-09.tsx`](./src/components/stats-09.tsx) - Cards de uso de recursos com barras de progresso.

  5. [`Padrão de estilização`]:
  
  Padrão de formulários:
  - [`form-advanced-7.tsx`](./src/components/form-advanced-7.tsx)
  - [`form-patterns-3.tsx`](./src/components/form-patterns-3.tsx)

  Padrão de estatísticas:
  - [`stats-03.tsx`](./src/components/stats-03.tsx)
  - [`stats-09.tsx`](./src/components/stats-09.tsx)

  Padrão para resultados vazios:
  - [`empty-standard-5.tsx`](./src/components/empty-standard-5.tsx)

  6. Textos traduzidos com [i18n](./src/config/i18n.ts): As traduções estão presentes e devem ser adicionadas nos 3 arquivos [`pt.json`](./src/config/translations/pt.json) (Default), [`en.json`](./src/config/translations/en.json) e [`es.json`](./src/config/translations/es.json)

  Exemplo de uso:
  ```tsx
  import { useTranslation } from 'react-i18next';

  function MyComponent() {
    const { t } = useTranslation();

    return (
      <div>
        {/* No JSX */}
        <h1>{t('welcome.title')}</h1>
        
        {/* Com Variáveis (Use chaves simples { }) */}
        <p>{t('welcome.message', { name: 'User' })}</p>
        
        {/* Em Atributos/Placeholders */}
        <Input placeholder={t('login.email.placeholder')} />
      </div>
    );
  }
  ```
---

### Como criar uma rota

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/permissions/users/")({
  component: ListUsersPage,
});
```

| Arquivo | Rota Gerada |
|---------|-------------|
| `index.tsx` | Gera a pagina raiz |
| `add.tsx` | Gera a pagina com rota /add |
| `edit.$id.tsx` | NÃO DEVE SER USADO |
| `$id.tsx` | Gera a pagina /:id e recebe o id como parametro |

### Como adicionar Search Params com Validação

```tsx
import { z } from 'zod';

const searchSchema = z.object({
  id: z.string().optional(),
  filter: z.string().optional(),
});

export const Route = createFileRoute("/_private/machine-list/")({
  component: MachineListPage,
  validateSearch: searchSchema,
});

// Dentro do componente:
const { id, filter } = useSearch({ from: '/_private/machine-list/' });
```

### Cliente de API

- **Localização**: [`src/lib/api/client.ts`](./src/lib/api/client.ts)
- **V2**: Use `{ isV2: true }` nas opções

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

### Ferramentas de Produtividade (OBRIGATÓRIO)
Utilizamos o **Inlang (Sherlock)** para gerenciar traduções diretamente no VS Code.
- **Hover**: Passe o mouse sobre uma chave `t("key")` para ver a tradução.
- **Extração**: Selecione um texto hardcoded e use `Cmd + .` para extrair para uma chave i18n automaticamente.
- **Lint**: Alertas automáticos para chaves faltando ou traduções idênticas.

Utilize o **Biome** para formatação de código. Antes de fazer commits rode `pnpm run format`.

Utilize o **TypeScript** para tipagem de código. Antes de fazer commits rode `pnpm run check`.

Utilize **Tailwind CSS intellisense** para ter as classes disponíveis. Clique Ctrl + Espaço (Windows) ou Cmd + Espaço (Mac) para ver as opções disponíveis estando o cursor dentro de uma className="".

## 📋 Checklist de Migração de Página Legada

### 1. Analisar Página Legada
- [ ] Identificar componentes de seleção (`SelectX`)
- [ ] Identificar chamadas de API (`Fetch.get/post`)
- [ ] Identificar campos do formulário

### 2. Verificar Hooks Existentes
- [ ] Checar [`src/hooks/`](./src/hooks) para hooks de API existentes
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
- [ ] Adicionar ou buscar as traduções em `src/config/translations/*.json`

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
