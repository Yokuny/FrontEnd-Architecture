const MINUTE_IN_MS = 60000;

/**
 * Format interval in milliseconds to human readable format
 */
export function formatInterval(interval?: number): string {
  if (!interval) return '-';

  if (interval < MINUTE_IN_MS) {
    return `${Math.round(interval / 1000)} s`;
  }

  return `${Math.round(interval / MINUTE_IN_MS)} min`;
}

/**
 * Calculate remaining days from creation date (30 day expiry)
 */
export function calculateRemainingDays(date?: string): number {
  const created = date ? new Date(date) : new Date();
  if (Number.isNaN(created.getTime())) return 30;
  const expiry = new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

/**
 * Get timezone offset as number
 */
export function getTimezoneOffset(): number {
  const offset = new Date().getTimezoneOffset();
  return -(offset / 60);
}
