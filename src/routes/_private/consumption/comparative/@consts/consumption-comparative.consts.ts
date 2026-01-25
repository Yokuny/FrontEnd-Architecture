import { UNIT_OPTIONS as SHARED_UNIT_OPTIONS } from '@/lib/constants/select-options';

export const UNIT_OPTIONS = SHARED_UNIT_OPTIONS;

export const VIEW_TYPE_OPTIONS = [
  { label: 'Consumo', value: 'consumption' },
  { label: 'Estoque', value: 'stock' },
];

export const DEFAULT_UNIT = 'm³';
export const DEFAULT_VIEW_TYPE = 'stock';
