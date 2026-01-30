export const INTERVAL_OPTIONS = [
  { value: null, labelKey: 'no.interval' },
  { value: 30000, label: '30 s' },
  { value: 60000, label: '1 min' },
  { value: 120000, label: '2 min' },
  { value: 300000, label: '5 min' },
  { value: 600000, label: '10 min' },
  { value: 1800000, label: '30 min' },
  { value: 3600000, label: '60 min' },
] as const;

export const STATUS_VARIANTS: Record<string, 'success' | 'error' | 'warning' | 'info' | 'neutral'> = {
  ready: 'success',
  processing: 'warning',
  error: 'error',
  empty: 'error',
  expired: 'error',
  pending: 'info',
};
