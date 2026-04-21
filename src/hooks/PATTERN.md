# src/hooks — Catalogo de Hooks Globais

> **ANTES de criar um novo hook**, verifique se o que voce precisa ja existe aqui.
> Para o padrao completo de implementacao de queries, consulte [`src/query/PATTERN.md`](../query/PATTERN.md).

---

## Estado Global (Zustand + persist)

| Hook | Arquivo | Proposito |
|------|---------|-----------|
| `useAuthStore` | `auth.ts` | Token JWT, usuario autenticado, `login()`, `logout()`, `checkAuthentication()` (persist) |
| `useFavorites` | `use-favorites.ts` | Links favoritos: `toggleFavorite`, `isFavorite` (persist) |
| `useSidebarToggle` / `useSidebar` | `use-sidebar-toggle.ts` | Estado do sidebar (expandido/colapsado), suporte mobile e hover (persist) |
| `useProfessionalColors` | `professionals.ts` | Cores persistentes por profissional no calendario (persist) |
| `useIsMobile` | `use-mobile.ts` | Detecta viewport mobile (`< 768px`) |

---

## Stores Utilitarios (Zustand — sem persist)

| Hook | Arquivo | Proposito |
|------|---------|-----------|
| `usePatientStore` | `patients.ts` | `getName(patients, id)`, `getImage(patients, id)`, `mapToCombobox(patients)` |
| `useProfessionalStore` | `professionals.ts` | `getName(professionals, id)`, `getImage(professionals, id)`, `mapToCombobox(professionals)` |
| `useFinancialStore` | `financials.ts` | `mapToCombobox(financials, patientId?)` — filtra financeiros por paciente |
| `useOdontogramStore` | `odontogram.ts` | `mapToCombobox(odontograms, patientId?)` — filtra odontogramas por paciente |
| `useClinicStore` | `clinic.ts` | `selectedRoom`, `setSelectedRoom`, `getRoomName(clinic, id)` — sala selecionada (persist) e nome da sala pelo ID |

---

## Hooks de UI e Layout

| Hook | Arquivo | Proposito |
|------|---------|-----------|
| `useCurrentTimeIndicator` | `use-current-time-indicator.ts` | Posicao do indicador de hora atual no calendario (`currentTimePosition`, `currentTimeVisible`) |
| `useEventVisibility` | `use-event-visibility.ts` | Calcula quantos eventos cabem no container via ResizeObserver (`getVisibleEventCount`) |
| `useStore` | `use-store.ts` | Helper generico para subscription SSR-safe de Zustand |
| `ThemeProvider` | `ThemeProvider.tsx` | Provider de tema (light/dark) via `next-themes` |

---

## Autenticacao

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Auth mutations | `../query/auth.ts` | `useAuthApi` → `login`, `signup`, `validateEmail`, `forgotPassword`, `completeSignup`, `resetPassword`, `logout` |

---

## Hooks de API (TanStack Query)

> Queries ficam centralizadas em [`src/query/`](../query/). Cada arquivo segue o padrao de [`src/query/PATTERN.md`](../query/PATTERN.md).

### Pacientes

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista parcial | `../query/patients.ts` | `usePatientsQuery` — lista resumida para comboboxes |
| Detalhe completo | `../query/patient.ts` | `usePatientQuery(id?)` — dados completos do paciente |
| Analytics | `../query/analytics.ts` | `usePatientAnalyticsQuery({ enabled? })` — metricas e estatisticas |

### Agendamentos

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Agenda | `../query/schedule.ts` | `useScheduleQuery(params)` — agendamentos por data/sala |
| Detalhe | `../query/schedule.ts` | `useScheduleDetailQuery(id?)` — agendamento completo |
| Por paciente | `../query/schedule.ts` | `usePatientSchedulesQuery(patientId?)` — historico do paciente |
| Criar | `../query/schedule.ts` | `useCreateSchedule` |
| Criar com paciente | `../query/schedule.ts` | `useCreateScheduledPatient` |
| Atualizar | `../query/schedule.ts` | `useUpdateSchedule` |
| Atualizar horario | `../query/schedule.ts` | `useUpdateScheduleTime` — drag & drop no calendario |
| Atualizar status | `../query/schedule.ts` | `useUpdateScheduleStatus` — confirmado/cancelado/etc |
| Deletar | `../query/schedule.ts` | `useDeleteSchedule` |
| Confirmacao | `../query/schedule.ts` | `useRequestScheduleConfirmation` — gera passkey de confirmacao |

### Financeiro

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista completa | `../query/financials.ts` | `useFinancialsQuery` |
| Lista parcial | `../query/financials.ts` | `useFinancialsPartialQuery` — para comboboxes |
| Detalhe | `../query/financials.ts` | `useFinancialDetailQuery(id?)` |
| Mutations | `../query/financials.ts` | `useFinancialMutations` → `create`, `update`, `updateStatus` |

### Odontograma

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista | `../query/odontogram.ts` | `useOdontogramsQuery` |
| Detalhe | `../query/odontogram.ts` | `useOdontogramDetailQuery(id?)` |
| Mutations | `../query/odontogram.ts` | `useOdontogramMutations` → `create`, `updateStatus` |

### Clinica

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Dados da clinica | `../query/clinic.ts` | `useClinicApi` — staleTime de 5min |
| Cache | `../query/clinic.ts` | `useClinicCache` → `setClinicCache(updater)`, `invalidateClinic()` |

### Profissionais (Dentistas)

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista | `../query/professionals.ts` | `useProfessionalsQuery` — todos profissionais da clinica |

### Procedimentos

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista | `../query/procedures.ts` | `useProceduresQuery` — catalogo de procedimentos |
| Sheet | `../query/procedures.ts` | `useProceduresSheetQuery` — formatado para ProceduresSheet |

### Lembretes

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Lista | `../query/reminders.ts` | `useRemindersQuery(query)` — por periodo e status |
| Criar | `../query/reminders.ts` | `useCreateReminder` |
| Atualizar em lote | `../query/reminders.ts` | `useCheckReminders` — marcar como lido/resolvido |

### Usuario

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Dados parciais | `../query/user.ts` | `useUserQuery` — dados do usuario logado (staleTime 5min) |

### Passkey (Confirmacao Publica)

| Hook | Arquivo | Exporta |
|------|---------|---------|
| Verificar | `../query/passkey.ts` | `usePasskeyQuery(code?)` — endpoint publico, sem token |

---

## Como Usar

### Query simples

```tsx
import { usePatientsQuery } from '@/query/patients';

function MyComponent() {
  const { data: patients, isLoading } = usePatientsQuery();
  // patients: PartialPatient[]
}
```

### Combobox com store utilitario

```tsx
import { usePatientsQuery } from '@/query/patients';
import { usePatientStore } from '@/hooks/patients';

function MyForm() {
  const { data: patients = [] } = usePatientsQuery();
  const { mapToCombobox } = usePatientStore();
  const options = mapToCombobox(patients);
  // options: { value, label, image }[]
}
```

### Mutations

```tsx
import { useFinancialMutations } from '@/query/financials';

function MyForm() {
  const { create, update } = useFinancialMutations();

  function onSubmit(data) {
    create.mutate(data, {
      onSuccess: () => toast.success(t('financial.created')),
    });
  }
}
```

### Agendamento no calendario

```tsx
import { useScheduleQuery, useUpdateScheduleTime } from '@/query/schedule';
import { useClinicStore } from '@/hooks/clinic';

function Calendar() {
  const { selectedRoom } = useClinicStore();
  const { data } = useScheduleQuery({ date: '2026-03-26', room: selectedRoom });
  const updateTime = useUpdateScheduleTime();

  function onDrop(id: string, newTime: string) {
    updateTime.mutate({ id, time: newTime });
  }
}
```

### Estado global fora de componente (em funcoes de API)

```tsx
import { useAuthStore } from '@/hooks/auth';

// Acesso direto ao store (sem hook)
const token = useAuthStore.getState().accessToken;
```

---

## Padrao de Implementacao

Consulte [`src/query/PATTERN.md`](../query/PATTERN.md) para:
- Estrutura completa com query keys, useQuery e useMutation
- Fetch functions privadas com `request()` + `GET()`/`POST()`/`PUT()`/`DELETE()`
- Invalidacao de cache no `onSuccess`
- Queries condicionais com `enabled`

---

## Endpoints do Back-End (Referencia Rapida)

> Back-end em [`../../DentalEase/DentalEase-BackEnd/`](../../../DentalEase/DentalEase-BackEnd/)

| Prefixo | Modulo | Operacoes |
|---------|--------|-----------|
| `/auth` | Autenticacao | signup, signin, logout, refresh, validate |
| `/patient` | Pacientes | CRUD + partial + odontogram + anamnesis + intraoral + image + analytics |
| `/schedule` | Agendamentos | CRUD + partial + status + time + confirmacao passkey |
| `/financial` | Financeiro | CRUD + partial + list + status + image |
| `/odontogram` | Odontogramas | CRUD + partial + list + status + image |
| `/clinic` | Clinica | get + create + update |
| `/user` | Usuarios | partial + professionals + update + password + invite + roles-rooms + google-token |
| `/procedure` | Procedimentos | get + update (single/batch) |
| `/reminder` | Lembretes | get + create + bulk-update |
| `/s3` | Upload | presigned-url |
| `/passkey` | Verificacao | get (publico) |

### Padrao CRUD

```
GET    /{module}           → Lista todos (com query params opcionais)
GET    /{module}/partial    → Lista resumida (ID + campos minimos para selects)
GET    /{module}/list       → Lista alternativa (quando existe)
GET    /{module}/:id        → Detalhe completo
POST   /{module}/create     → Criar registro
PUT    /{module}/:id        → Atualizar registro
PATCH  /{module}/:id/status → Atualizar status
DELETE /{module}/:id        → Deletar (admin only)
```
