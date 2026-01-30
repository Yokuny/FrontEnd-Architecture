export const SENSOR_TYPE_OPTIONS = [
  { value: 'decimal', label: 'Decimal' },
  { value: 'double', label: 'Double' },
  { value: 'int', label: 'Integer' },
  { value: 'bool', label: 'Boolean' },
  { value: 'bool_number', label: 'Boolean Number' },
  { value: 'string', label: 'String' },
] as const;

export const NUMERIC_TYPES = ['decimal', 'double', 'int'] as const;
export const BOOLEAN_TYPES = ['bool', 'bool_number'] as const;
export const EDITABLE_TYPES = [...NUMERIC_TYPES, ...BOOLEAN_TYPES] as const;

export const SORT_PRIORITY_TYPES = ['decimal', 'double', 'int'] as const;

export const DAYS_FILTER_OPTIONS = [
  { value: 1, label: '1 D' },
  { value: 3, label: '3 D' },
  { value: 7, label: '7 D' },
] as const;
