# Recursos Disponiveis no Projeto

## Componentes de Data Inputs (7 em `src/components/data-inputs/`)

Usar os componentes prontos ao inves de criar comboboxes e selects do zero. Ja encapsulam estado, loading, busca e erro.

```tsx
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import FinancialCombobox from '@/components/data-inputs/financial-combobox';

// Combobox de paciente
<PatientCombobox controller={field} fetchPatients={fetchPatients} />

// Combobox de profissional (dentista)
<ProfessionalCombobox controller={field} fetchProfessionals={fetchProfessionals} />

// Combobox de registro financeiro
<FinancialCombobox controller={field} patient={idPatient} fetchFinancials={fetchFinancials} />
```

**Props padrao:** `controller`, `disabled?`, `fetchFn` (funcao async que retorna `{ value, label }[]`)

**Componentes disponiveis:**

| Componente | Import | Descricao |
|------------|--------|-----------|
| `PatientCombobox` | `@/components/data-inputs/patient-combobox` | Selecao de paciente com avatar |
| `ProfessionalCombobox` | `@/components/data-inputs/professional-combobox` | Selecao de dentista/profissional com avatar |
| `FinancialCombobox` | `@/components/data-inputs/financial-combobox` | Selecao de registro financeiro por paciente |
| `OdontogramCombobox` | `@/components/data-inputs/odontogram-combobox` | Selecao de odontograma por paciente |
| `ProcedureComponent` | `@/components/data-inputs/procedure-component` | Lista editavel de procedimentos (useFieldArray) |
| `ProceduresSheet` | `@/components/data-inputs/procedures-sheet` | Sheet lateral para selecionar procedimentos cadastrados |
| `DatePickerButton` | `@/components/data-inputs/date-picker-button` | Botao com popover de calendario |

## Componentes de Dominio

| Componente | Import | Descricao |
|------------|--------|-----------|
| `DateTimePicker` | `@/components/date-time-picker` | Seletor de data/hora com dia inteiro, intervalo de datas e horarios |
| `DentalEaseLogo` | `@/components/dental-ease-logo` | Logo do DentalEase com link para home |
| `ToothNumber` | `@/components/odontogram/tooth-number` | Renderiza SVG de dente por numero (odontograma) com status visual |

## Hooks Globais (em `src/hooks/`)

**ANTES de criar um hook**, verifique se ja existe em `src/hooks/`!

| Hook | Descricao |
|------|-----------|
| `useAuth` | Sessao e login do usuario |
| `useHasPermission` | Verifica permissoes do usuario |
| `useSidebar` | Estado da sidebar |
| `useSidebarToggle` | Toggle da sidebar |
| `useIsMobile` | Detecta dispositivo mobile |

## Componentes Obrigatorios

| Componente | Import | Uso |
|------------|--------|-----|
| `DefaultEmptyData` | `@/components/default-empty-data` | Dados vazios |
| `DefaultLoading` | `@/components/default-loading` | Loading |
| `DefaultFormLayout` | `@/components/default-form-layout` | Layout de formularios |

## Componentes de UI

- **Paginas**: Usar `Card`, `CardHeader`, `CardContent`, `CardFooter`
- **Componentes comuns**: NUNCA Card. Usar `Item`, `ItemTitle`, `ItemDescription` de `@/components/ui/item`
- **Charts**: `getChartColor(index)` de `src/components/ui/chart`. NUNCA `mx-auto` no ChartContainer
