# Recursos Disponíveis no Projeto

## Componentes de Data Inputs (`src/components/data-inputs/`)

Usar os componentes prontos ao invés de criar comboboxes e selects do zero. Já encapsulam estado, loading, busca e erro.

| Componente | Import | Descrição |
|------------|--------|-----------|
| `PatientCombobox` | `@/components/data-inputs/patient-combobox` | Seleção de paciente com avatar e busca |
| `ProfessionalCombobox` | `@/components/data-inputs/professional-combobox` | Seleção de dentista/profissional com avatar |
| `FinancialCombobox` | `@/components/data-inputs/financial-combobox` | Seleção de registro financeiro filtrado por paciente |
| `OdontogramCombobox` | `@/components/data-inputs/odontogram-combobox` | Seleção de odontograma filtrado por paciente |
| `ProcedureComponent` | `@/components/data-inputs/procedure-component` | Lista editável de procedimentos (useFieldArray) |
| `ProceduresSheet` | `@/components/data-inputs/procedures-sheet` | Sheet lateral para selecionar procedimentos cadastrados |
| `DatePickerButton` | `@/components/data-inputs/date-picker-button` | Botão com popover de calendário |
| `DateTimePicker` | `@/components/data-inputs/date-time-picker` | Seletor de data/hora com dia inteiro, intervalo e horários em 15min |

**Props padrão dos comboboxes:** `controller` (react-hook-form), `disabled?`, `fetchFn` (async que retorna `{ value, label }[]`)

## Componentes de Domínio

| Componente | Import | Descrição |
|------------|--------|-----------|
| `DentalEaseLogo` | `@/components/dental-ease-logo` | Logo com link para home |
| `ToothNumber` | `@/components/odontogram/tooth-number` | SVG de dente por número com status visual |
| `UploadImage` | `@/components/upload-image` | Upload de imagem |
| `MobileDock` | `@/components/mobile-dock` | Navegação mobile |

## Componentes Obrigatórios

| Componente | Import | Quando Usar |
|------------|--------|-------------|
| `DefaultEmptyData` | `@/components/default-empty-data` | Dados vazios ou busca sem resultado |
| `DefaultLoading` | `@/components/default-loading` | Qualquer loading/requisição pendente |
| `DefaultFormLayout` | `@/components/default-form-layout` | Layout de formulários com seções |
| `DefaultKPI` | `@/components/default-KPI` | Exibição de números e KPIs |
| `DefaultStatsSection` | `@/components/default-stats-section` | Seção de estatísticas |

## Componentes de UI (ShadCN)

Todos em `src/components/ui/`. Os mais usados:

**Páginas:** `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardAction`
**Componentes comuns:** `Item`, `ItemGroup`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemMedia`, `ItemActions`, `ItemHeader`, `ItemFooter`
**Dados:** `DataTable`, `DataTableColumn`, `DataTableColumnHeader`, `DataTablePagination`
**Formulários:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
**Inputs:** `Input`, `Select`, `Checkbox`, `Switch`, `Textarea`, `RadioGroup`
**Feedback:** `Badge`, `Spinner`, `Skeleton`, `Progress`, `Timeline`
**Overlays:** `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Popover`, `DropdownMenu`, `Tooltip`
**Navegação:** `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`

## Hooks Globais (`src/hooks/`)

**Verificar aqui ANTES de criar um hook novo.**

| Hook | Arquivo | Descrição |
|------|---------|-----------|
| `useAuth` | `auth.ts` | Sessão, login, logout, token |
| `usePatientStore` | `patients.ts` | getName, getImage, mapToCombobox |
| `useProfessionalStore` | `professionals.ts` | Lookup de profissionais |
| `useProfessionalColors` | `professionals.ts` | Cores persistentes por profissional |
| `useFinancialStore` | `financials.ts` | mapToCombobox financeiros |
| `useOdontogramStore` | `odontogram.ts` | mapToCombobox odontogramas |
| `useClinicStore` | `clinic.ts` | getRoomName |
| `useUserStore` | `user.ts` | Sala selecionada (persist) |
| `useFavorites` | `use-favorites.ts` | Favoritos persistentes |
| `useIsMobile` | `use-mobile.ts` | Detecta dispositivo mobile |
| `useSidebar` | `use-sidebar-toggle.ts` | Estado da sidebar |
| `useCurrentTimeIndicator` | `use-current-time-indicator.ts` | Posição do indicador de hora no calendário |
| `useEventVisibility` | `use-event-visibility.ts` | Eventos visíveis no calendário (ResizeObserver) |

## Query Hooks (`src/query/`)

| Arquivo | Keys | Hooks Principais |
|---------|------|-----------------|
| `patients.ts` | `patientsKeys` | `usePatientsQuery`, `usePatientDetailQuery`, `usePatientMutations` |
| `financials.ts` | `financialsKeys` | `useFinancialsQuery`, `useFinancialDetailQuery`, `useFinancialMutations` |
| `schedules.ts` | `schedulesKeys` | `useSchedulesQuery`, `useScheduleDetailQuery`, `useScheduleMutations` |
| `odontogram.ts` | `odontogramKeys` | `useOdontogramQuery`, `useOdontogramMutations` |
| `clinic.ts` | `clinicKeys` | `useClinicApi`, `useClinicCache` |
| `user.ts` | `userKeys` | `useUserQuery` |
| `procedures.ts` | `proceduresKeys` | `useProceduresQuery` |
| `reminders.ts` | `remindersKeys` | `useRemindersQuery`, `useReminderMutations` |

## Helpers (`src/lib/helpers/`)

| Arquivo | Funções Principais |
|---------|-------------------|
| `translate.ts` | `t(key)` — traduz chave via `translations.json` |
| `formatDate.utils.ts` | `formatDate(date, pattern?, fallback?)`, `formatDistanceToNow(date)`, `getLocalizedMonths()` |
| `formatter.helper.ts` | `formatPhone()`, `formatCPF()`, `formatCurrency()`, `formatCEP()` |
| `calendar.utils.ts` | Utilitários de calendário |
| `regex.helper.ts` | Regex patterns |
| `upload.helper.ts` | Upload de arquivos |
| `validade.helper.ts` | Validações |
| `zodMessage.helper.ts` | Mensagens de erro Zod customizadas |
| `dataManager.helper.ts` | Utilitários de dados |

## Ícones (`src/components/icons/`)

94 ícones SVG customizados. Import: `@/components/icons/{Nome}.Icon`

Exemplos: `Add`, `Edit`, `Delete`, `Check`, `Search`, `Clock`, `User`, `Clinic`, `Patients`, `ChartPie`, `Calender`, `Copy`, `Sort`, `Send`, `Package`, `Point`

## API Client (`src/lib/api/client.ts`)

```tsx
import { GET, POST, PUT, PATCH, DELETE, request, api } from '@/lib/api/client';

// Fetch direto
const res = await request('patient', GET());
const res = await request('patient', POST(body));

// Estilo axios (retorna { data: Response<T> })
const { data } = await api.get<Patient[]>('patient');
const { data } = await api.post<Patient>('patient', body);
```

- Auth automático via token do Zustand store
- Header: `Authorization: Ease ${token}`
- Base URL: `import.meta.env.VITE_CORE_URL`
