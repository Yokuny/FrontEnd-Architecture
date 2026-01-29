export const MARKER_TYPE_OPTIONS = [
  { value: 'label', labelKey: 'label' },
  { value: 'on-off', label: 'ON / OFF' },
  { value: 'maintenance', labelKey: 'maintenance' },
] as const;

export type MarkerType = (typeof MARKER_TYPE_OPTIONS)[number]['value'];
