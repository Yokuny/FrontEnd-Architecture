import type { Locale } from '@/hooks/use-locale';

export interface LanguageOption {
  value: Locale;
  label: string;
  locale: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    value: 'pt',
    label: 'Português Brasil',
    locale: 'pt',
  },
  {
    value: 'en',
    label: 'English',
    locale: 'en',
  },
  {
    value: 'es',
    label: 'Español',
    locale: 'es',
  },
];

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português Brasil',
};

export interface FasTypeOption {
  id: string;
  name: string;
}

export const FAS_TYPES: FasTypeOption[] = [
  { id: 'Normal', name: 'Normal' },
  { id: 'Emergencial', name: 'Emergencial' },
  { id: 'Docagem - Normal', name: 'Docagem - Normal' },
  { id: 'Docagem - Emergencial', name: 'Docagem - Emergencial' },
];

export const FAS_REGULARIZATION_TYPES: FasTypeOption[] = [
  { id: 'Regularizacao', name: 'Regularização' },
  { id: 'Docagem - Regularizacao', name: 'Docagem - Regularização' },
];

export interface FenceTypeOption {
  id: string;
  name: string;
  color: string;
}

export const FENCE_TYPES: FenceTypeOption[] = [
  { id: 'anchorage', name: 'Ancoradouro', color: '#00A2E8' },
  { id: 'bar', name: 'Barra', color: '#A349A4' },
  { id: 'basin', name: 'Bacia', color: '#1939B7' },
  { id: 'dangerNavigation', name: 'Perigo à Navegação', color: '#ED1C24' },
  { id: 'field', name: 'Campo', color: '#11A24F' },
  { id: 'monitoring', name: 'Monitoramento', color: '#008080' },
  { id: 'pier', name: 'Píer', color: '#FF7F27' },
  { id: 'port', name: 'Porto', color: '#3366FF' },
  { id: 'route', name: 'Rota', color: '#22B14C' },
  { id: 'shipyard', name: 'Estaleiro', color: '#FFF200' },
  { id: 'warnNavigation', name: 'Aviso à Navegação', color: '#FFB70F' },
  { id: 'other', name: 'Outro', color: '#7F7F7F' },
];

export interface LevelOption {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const LEVEL_OPTIONS: LevelOption[] = [
  { id: 'critical', name: 'Crítico', color: '#d43542', icon: 'XCircle' },
  { id: 'warning', name: 'Aviso', color: '#d6cb36', icon: 'AlertTriangle' },
  { id: 'info', name: 'Informativo', color: '#66b83a', icon: 'Info' },
];

export interface OsOption {
  value: string;
  label: string;
}

export const OS_OPTIONS: OsOption[] = [
  { value: 'Sim', label: 'Sim' },
  { value: 'Não', label: 'Não' },
  { value: 'N/A', label: 'N/A' },
];

export interface MachineTypeOption {
  value: string;
  label: string;
}

export const MACHINE_TYPES: MachineTypeOption[] = [
  { value: 'ship', label: 'Embarcação' },
  { value: 'truck', label: 'Caminhão' },
  { value: 'industrial', label: 'Máquina Industrial' },
];

export interface SafetyAreaOption {
  value: string;
  label: string;
}

export const SAFETY_AREAS: SafetyAreaOption[] = [
  { value: 'invaded', label: 'Invasão' },
  { value: 'warn_1', label: 'Aviso 1' },
  { value: 'warn_2', label: 'Aviso 2' },
];

export interface VariableTypeOption {
  value: string;
  label: string;
}

export const VARIABLE_TYPES: VariableTypeOption[] = [
  { value: 'int', label: 'INT' },
  { value: 'decimal', label: 'DECIMAL' },
  { value: 'double', label: 'DOUBLE' },
  { value: 'geo', label: 'GEO (LAT, LON)' },
  { value: 'bool', label: 'BOOLEAN' },
  { value: 'bool_number', label: 'BOOLEAN NUMBER (0, 1)' },
  { value: 'string', label: 'STRING' },
  { value: 'object', label: 'OBJECT' },
  { value: 'array', label: 'ARRAY' },
];

export interface PriorityOption {
  value: number;
  label: string;
  color: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 0, label: 'Baixa', color: '#6DD332' },
  { value: 1, label: 'Média', color: '#FFB649' },
  { value: 2, label: 'Alta', color: '#c4183c' },
];

export interface ViewOption {
  value: string;
  label: string;
}

export const VIEW_OPTIONS: ViewOption[] = [
  { value: 'operational', label: 'Operacional' },
  { value: 'financial', label: 'Financeiro' },
];

export interface ConditionOption {
  value: string;
  label: string;
}

export const CONDITION_OPTIONS: ConditionOption[] = [
  { value: 'lessThan', label: 'Menor que' },
  { value: 'lessThanOrEqual', label: 'Menor ou igual a' },
  { value: 'equal', label: 'Igual a' },
  { value: 'greatThan', label: 'Maior que' },
  { value: 'greatThanOrEqual', label: 'Maior ou igual a' },
  { value: 'between', label: 'Entre' },
  { value: 'different', label: 'Diferente de' },
];

export interface VisibilityOption {
  value: string;
  labelKey: string;
}

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  { value: 'public', labelKey: 'visibility.public' },
  { value: 'private', labelKey: 'visibility.private' },
  { value: 'limited', labelKey: 'visibility.limited' },
];

export interface EditPermissionOption {
  value: string;
  labelKey: string;
}

export const EDIT_PERMISSION_OPTIONS: EditPermissionOption[] = [
  { value: 'all', labelKey: 'edit.permission.all' },
  { value: 'admin', labelKey: 'edit.permission.admin' },
  { value: 'owner', labelKey: 'edit.permission.owner' },
];

export interface CredentialsOption {
  value: string;
  labelKey: string;
}

export const CREDENTIALS_OPTIONS: CredentialsOption[] = [
  { value: 'password', labelKey: 'login.password' },
  { value: 'sso', labelKey: 'SSO' },
];
export interface FormTypeOption {
  value: string;
  labelKey: string;
}

export const FORM_TYPE_OPTIONS: FormTypeOption[] = [
  { value: 'RVE', labelKey: 'RVE' },
  { value: 'EVENT_REPORT', labelKey: 'Relatório de evento diário' },
  { value: 'FILL_ONBOARD', labelKey: 'fill.onboard' },
  { value: 'OTHER', labelKey: 'other' },
  { value: 'NOON_REPORT', labelKey: 'Noon Report' },
  { value: 'POLL', labelKey: 'polling' },
  { value: 'RDO', labelKey: 'RDO' },
  { value: 'EVENT', labelKey: 'event' },
  { value: 'CMMS', labelKey: 'CMMS' },
];
