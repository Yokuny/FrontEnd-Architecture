export const STATUS_VARIANTS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
  Success: 'success',
  Danger: 'error',
  Warning: 'warning',
  Info: 'info',
  Basic: 'neutral',
};

export const BENCHMARK_ITEMS = [
  { key: 'working', status: 'Success', labelKey: 'working' },
  { key: 'inalert', status: 'Danger', labelKey: 'in.alert' },
  { key: 'warning', status: 'Warning', labelKey: 'attention' },
  { key: 'stopped', status: 'Info', labelKey: 'stopped' },
  { key: 'off', status: 'Basic', labelKey: 'offline' },
] as const;
