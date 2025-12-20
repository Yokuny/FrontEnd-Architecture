# Arquitetura do Projeto

> Documentação rápida para navegação e desenvolvimento

## 🎨 Componentes UI

### ShadCN UI
- **Localização**: [`src/components/ui`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/components/ui)
- **Uso**: Todos os componentes base do projeto (40+ componentes)
- **Importante**: Sempre usar estes componentes para manter integridade visual

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
│       ├── @interface/      # Tipagens e schemas Zod
│       ├── index.tsx        # Rota principal
│       ├── register.tsx     # Subrota
│       └── reset-password.tsx
```

**Convenções**:
- Pastas com `@` são ignoradas pelo router
- `@components` - Componentes específicos da rota
- `@consts` - Constantes e valores fixos
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

### Idiomas Suportados
- **Inglês** (`en`)
- **Espanhol** (`es`)
- **Português** (`pt`)

### Traduções
- **Localização**: [`translations/`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/translations)
  - `en.json`
  - `es.json`
  - `pt.json`

### Hook de Idioma
```tsx
import { useLocale } from "@/hooks/use-locale";

const { locale, setLocale } = useLocale();
```

### Uso no Código
```tsx
import { FormattedMessage } from "react-intl";

<FormattedMessage 
  id="login.title" 
  defaultMessage="Welcome Back" 
/>
```

**Exemplo completo**: [`src/routes/_public/auth/index.tsx:L135-L140`](file:///Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/routes/_public/auth/index.tsx#L135-L140)

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
- [ ] Exportar tipos e interfaces

### Adicionar Texto
- [ ] Usar `<FormattedMessage id="..." />`
- [ ] Adicionar chave em `translations/en.json`
- [ ] Adicionar chave em `translations/es.json`
- [ ] Adicionar chave em `translations/pt.json`
