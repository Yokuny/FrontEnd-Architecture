# Refatoração: `_private/schedule` → Padrão da Arquitetura

Rota: `src/routes/_private/schedule/`  
Objetivo: Extrair e agrupar lógica dos `@components` nos diretórios corretos da arquitetura.

---

## ✅ Concluído

### `@interface/schedule.interface.ts`
Adicionados todos os tipos/interfaces que estavam nos `@components`:

| Tipo | Origem |
|------|--------|
| `ScheduleFormProps` | `schedule-form.tsx` |
| `EventDialogProps` | `event-dialog.tsx` |
| `TimeUpdateProps` | `time-update-dialog.tsx` |
| `ScheduleRenderProps` | `schedule-render.tsx` |
| `CalendarDndContextType` | `calendar-dnd-context.tsx` |
| `CalendarDndProviderProps` | `calendar-dnd-context.tsx` |
| `EventWrapperProps` | `event-item.tsx` |
| `EventItemProps` | `event-item.tsx` |
| `DraggableEventProps` | `draggable-event.tsx` |
| `DroppableCellProps` | `square.tsx` |
| `MonthViewProps` | `month-view.tsx` |
| `WeekViewProps` | `week-view.tsx` |
| `PositionedEvent` | `week-view.tsx` / `day-view.tsx` |
| `DayViewProps` | `day-view.tsx` |
| `AgendaViewProps` | `agenda-view.tsx` |

---

### `@consts/schedule.consts.ts`
Adicionado `statusOptions` extraído de `schedule-render.tsx`:

```ts
export const statusOptions = [
  { value: 'pending', label: t('pending') },
  { value: 'waiting', label: t('waiting') },
  // ... 7 opções de status
];
```

---

### `@utils/schedule.utils.ts`
Adicionadas duas funções utilitárias extraídas dos `@components`:

| Função | Origem | Descrição |
|--------|--------|-----------|
| `formatTimeWithOptionalMinutes(date)` | `event-item.tsx` (inline) | Formata hora omitindo minutos se for `:00` |
| `extractTimeFromISO(iso?)` | `schedule-form.tsx` (inline) | Extrai `HH:mm` de uma string ISO |

Ambas usam `formatDate` do helper (não mais `format` direto do `date-fns`).

---

### `@hooks/use-schedule-form.ts` *(novo arquivo)*
Criado extraindo **toda** a lógica de negócio de `schedule-form.tsx`:

**Estado gerenciado pelo hook:**
- `startDateTime`, `endDateTime` — datas ISO do evento
- `allDay` — evento dia inteiro
- `activeTab` — aba ativa (`appointment` / `newpatient` / `roomevent`)
- `roomEvent` — flag de evento de sala (sem paciente)
- `selectedRoom`, `selectedRoomName` — sala selecionada
- `isLoading` — estado de loading das mutations

**Derivações:**
- `rooms` — merge de salas da clínica + salas do usuário (via `useMemo`)
- `isEditMode` — `Boolean(event?._id)`
- `getRoomName`, `getPatientName` — helpers via stores

**Callbacks e handlers:**
- `fetchPatients()` — fetch para o `PatientCombobox`
- `fetchProfessionals()` — fetch para o `ProfessionalCombobox`
- `resetForm()` — reset completo ao abrir formulário vazio
- `clearFields()` — limpa campos ao trocar de aba
- `handleSave()` — lógica de create/update (3 fluxos: atendimento, novo paciente, evento de sala)
- `handleDelete()` — DELETE do agendamento
- `handleCancel()` — fecha sem salvar

**Retorna** tudo acima + `extractTimeFromISO` (importado de `@utils`).

---

### `@components/schedule-form.tsx`
Refatorado para usar `useScheduleForm`:
- Removidos: todos os `useState`, `useEffect`, `useMemo`, `useCallback`, lógica de API
- Mantido: apenas JSX + imports de UI
- Importa `ScheduleFormProps` de `@interface`
- Usa `useScheduleForm` para todo o comportamento

---

## 🔲 Pendente

### `@components/time-update-dialog.tsx`

**Violações a corrigir:**

| Violação | Regra | Correção |
|----------|-------|----------|
| `export const TimeUpdateDialog = (...) =>` | `function` declarations obrigatórias | `export function TimeUpdateDialog(...)` |
| `import { format } from 'date-fns'` | Nunca importar `format` direto | `formatDate` de `@/lib/helpers/formatDate.helper` |
| `import { ptBR } from 'date-fns/locale'` | Locale já encapsulado no helper | Remover import |
| `type TimeUpdateProps` no final do arquivo | Tipos em `@interface` | Remover daqui, importar de `@interface` |
| `<p>`, `<div>` com className de texto | HTML estilizado proibido | `<Item>`, `<ItemTitle>`, `<ItemDescription>`, `<ItemActions>` |

**Substituições de `format`:**
```tsx
// Antes
format(new Date(pendingEvent.end), 'dd - MMM', { locale: ptBR })
format(new Date(pendingEvent.end), 'EEE', { locale: ptBR })
format(new Date(pendingEvent.start), 'HH:mm', { locale: ptBR })
format(new Date(pendingEvent.end), 'HH:mm', { locale: ptBR })

// Depois
formatDate(new Date(pendingEvent.end), 'dd - MMM')
formatDate(new Date(pendingEvent.end), 'EEE')
formatDate(new Date(pendingEvent.start), 'HH:mm')
formatDate(new Date(pendingEvent.end), 'HH:mm')
```

**Substituições HTML → Item:**
```tsx
// Antes
<div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
  <p className="text-muted-foreground text-sm">Dia</p>
  <div className="flex w-full items-baseline gap-2">
    <p className="font-bold text-2xl tabular-nums">...</p>
    <p className="text-muted-foreground text-sm">...</p>
  </div>
  <p className="text-muted-foreground text-sm">Horário</p>
  <div className="flex w-full items-center gap-2">
    <p className="font-bold text-xl tabular-nums">...</p>-
    <p className="font-bold text-xl tabular-nums">...</p>
  </div>
</div>

// Depois
<Item className="flex-col gap-2">
  <ItemDescription>Dia</ItemDescription>
  <ItemActions className="items-baseline gap-2">
    <ItemTitle className="text-2xl tabular-nums">...</ItemTitle>
    <ItemDescription>...</ItemDescription>
  </ItemActions>
  <ItemDescription>Horário</ItemDescription>
  <ItemActions className="items-center gap-2">
    <ItemTitle className="text-xl tabular-nums">...</ItemTitle>
    -
    <ItemTitle className="text-xl tabular-nums">...</ItemTitle>
  </ItemActions>
</Item>
```

---

### `@components/schedule-render.tsx`

**Violações a corrigir:**

| Violação | Regra | Correção |
|----------|-------|----------|
| `export const ScheduleRender = (...) =>` | `function` declarations | `export function ScheduleRender(...)` |
| `import { format } from 'date-fns'` | Nunca direto | `formatDate` do helper |
| `import { ptBR } from 'date-fns/locale/pt-BR'` | Locale no helper | Remover |
| `statusOptions` definido inline no componente | Constantes em `@consts` | Importar de `@consts/schedule.consts` |
| `type ScheduleRenderProps` no final | Tipos em `@interface` | Remover, importar de `@interface` |
| `<p>`, `<div>` com className de texto em toda a renderização | HTML proibido | `<ItemTitle>`, `<ItemDescription>`, `<Item>`, `<ItemContent>`, `<ItemActions>` |

**Substituições de `format`:**
```tsx
// Comparação de datas (renderScheduleDateTime)
format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')
→ formatDate(startDate, 'yyyy-MM-dd') === formatDate(endDate, 'yyyy-MM-dd')

// Exibição
format(startDate, 'dd - MMM', { locale: ptBR })  →  formatDate(startDate, 'dd - MMM')
format(startDate, 'EEEEEE', { locale: ptBR })     →  formatDate(startDate, 'EEEEEE')
format(endDate, 'dd - MMM', { locale: ptBR })     →  formatDate(endDate, 'dd - MMM')
format(endDate, 'EEEEEE', { locale: ptBR })       →  formatDate(endDate, 'EEEEEE')
```

---

### `@components/event-item.tsx`

**Violações a corrigir:**

| Violação | Regra | Correção |
|----------|-------|----------|
| `formatTimeWithOptionalMinutes` definida inline | Funções utilitárias em `@utils` | Importar de `@utils/schedule.utils` |
| `import { format, getMinutes } from 'date-fns'` | `format` proibido direto | Remover (já encapsulado no @utils) |
| `type EventWrapperProps` e `export type EventItemProps` no final | Tipos em `@interface` | Remover, importar de `@interface` |

---

### `@components/calendar-dnd-context.tsx`

**Violações a corrigir:**

| Violação | Regra | Correção |
|----------|-------|----------|
| `export const useCalendarDnd = () => useContext(...)` | `function` declarations | `export function useCalendarDnd() { return useContext(...); }` |
| `type CalendarDndContextType` inline | Tipos em `@interface` | Remover, importar de `@interface` |
| `type CalendarDndProviderProps` inline | Tipos em `@interface` | Remover, importar de `@interface` |

---

### Remoção de tipos locais nas views

Todos os arquivos abaixo declaram seus `*Props` tipos localmente. Devem:
1. Remover o tipo local
2. Importar de `@interface/schedule.interface`

| Arquivo | Tipos a remover |
|---------|----------------|
| `@components/draggable-event.tsx` | `type DraggableEventProps` |
| `@components/square.tsx` | `type DroppableCellProps` |
| `@components/month-view.tsx` | `type MonthViewProps` |
| `@components/week-view.tsx` | `type WeekViewProps`, `type PositionedEvent` |
| `@components/day-view.tsx` | `type DayViewProps`, `type PositionedEvent` |
| `@components/agenda-view.tsx` | `type AgendaViewProps` |

**Bônus — `week-view.tsx` e `day-view.tsx`:**  
Usam `format(hour, 'h a')` diretamente do `date-fns`. Substituir por `formatDate(hour, 'h a')`.

---

## Resumo de Progresso

```
[✅] @interface/schedule.interface.ts  — todos os tipos centralizados
[✅] @consts/schedule.consts.ts        — statusOptions adicionado
[✅] @utils/schedule.utils.ts          — formatTimeWithOptionalMinutes + extractTimeFromISO
[✅] @hooks/use-schedule-form.ts       — criado (lógica completa extraída)
[✅] @components/schedule-form.tsx     — refatorado para usar o hook

[🔲] @components/time-update-dialog.tsx  — arrow→function, format→formatDate, HTML→Item, tipo
[🔲] @components/schedule-render.tsx     — arrow→function, format→formatDate, statusOptions, HTML→Item, tipo
[🔲] @components/event-item.tsx          — importar formatTimeWithOptionalMinutes, remover tipo
[🔲] @components/calendar-dnd-context.tsx — useCalendarDnd arrow→function, remover tipos
[🔲] @components/draggable-event.tsx     — remover tipo local
[🔲] @components/square.tsx              — remover tipo local
[🔲] @components/month-view.tsx          — remover tipo local
[🔲] @components/week-view.tsx           — remover tipos locais + format→formatDate
[🔲] @components/day-view.tsx            — remover tipos locais + format→formatDate
[🔲] @components/agenda-view.tsx         — remover tipo local
```

---

## Regras Aplicadas

| Regra | Fonte (CLAUDE.md) |
|-------|-------------------|
| Tipos/interfaces em `@interface/` | Estrutura de Pastas por Rota |
| Constantes em `@consts/` | Estrutura de Pastas por Rota |
| Funções utilitárias em `@utils/` | Estrutura de Pastas por Rota |
| Lógica de formulário em `@hooks/use-{feature}-form.ts` | Formulários — react-hook-form + Zod |
| `function` declarations (nunca `const Comp = () =>`) | Padrões React |
| `formatDate()` do helper (nunca `format` direto do date-fns) | Formatação de Datas |
| `<ItemTitle>`, `<ItemDescription>` (nunca `<p>`, `<span>` com estilo) | UI — ShadCN Sempre, HTML Nunca |
