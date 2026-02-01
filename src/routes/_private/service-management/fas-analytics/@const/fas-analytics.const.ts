/**
 * Chart groups configuration
 */
export const CHART_GROUPS = [
  { value: 'realized.orders', label: 'fas.completed.chart', orderFilter: true, dependantOptions: ['month', 'vessel'] },
  { value: 'header.types', label: 'fas.types.chart', orderFilter: false, dependantOptions: ['month', 'vessel'] },
  { value: 'order.status', label: 'fas.status.chart', orderFilter: true, dependantOptions: ['month', 'vessel'] },
  { value: 'fas.bms.value.chart', label: 'fas.bms.value.chart', orderFilter: false, dependantOptions: ['month', 'year', 'vessel'] },
  { value: 'order.bms.value.chart', label: 'order.bms.value.chart', orderFilter: true, dependantOptions: ['month', 'year', 'vessel', 'supplier'] },
] as const;

/**
 * Month names for filtering
 */
export const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const;

/**
 * Available years for filtering
 */
export const YEARS = [2023, 2024, 2025, 2026] as const;

/**
 * FAS type options
 */
export const FAS_TYPES = [
  { value: 'BMS', label: 'BMS' },
  { value: 'CLASSE', label: 'CLASSE' },
  { value: 'REQUISICAO', label: 'REQUISICAO' },
  { value: 'REGULARIZACAO', label: 'REGULARIZACAO' },
] as const;

/**
 * Status options for filtering
 */
export const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'status.open' },
  { value: 'IN_PROGRESS', label: 'status.in.progress' },
  { value: 'COMPLETED', label: 'status.completed' },
  { value: 'CANCELLED', label: 'status.cancelled' },
] as const;
/**
 * Default filter values
 */
export const FILTER_DEFAULTS = {
  FILTER_TYPE: 'range' as 'range' | 'month',
  DEPENDANT_AXIS: 'month' as 'month' | 'year' | 'vessel' | 'supplier',
  SHOW_VALUE_BY_PAYMENT: false,
} as const;
