/**
 * Get color status variant based on date age
 */
export function getStatusByDate(date?: string): 'success' | 'warning' | 'error' | 'secondary' {
  if (!date) return 'secondary';

  const diffMinutes = (Date.now() - new Date(date).getTime()) / (1000 * 60);
  if (diffMinutes < 120) return 'success';
  if (diffMinutes < 1440) return 'warning';
  return 'error';
}

/**
 * Format number with fixed decimals
 */
export function formatNumber(value: number | undefined, decimals = 1): string {
  if (value === undefined) return '0';
  return value.toFixed(decimals);
}
