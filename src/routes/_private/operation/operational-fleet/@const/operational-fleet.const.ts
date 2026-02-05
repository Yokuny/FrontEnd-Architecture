/**
 * Default date range in days for operational fleet dashboard
 */
export const DEFAULT_RANGE_DAYS = 30;

/**
 * Maximum percentage value cap
 */
export const MAX_PERCENTAGE = 100;

/**
 * Operational average thresholds for color coding
 */
export const OPERATIONAL_THRESHOLDS = {
  EXCELLENT: 90, // >= 90% - Green (Emerald)
  GOOD: 70, // >= 70% - Yellow (Amber)
  // < 70% - Red (Rose)
} as const;

/**
 * Color mappings for operational average based on thresholds
 */
export const OPERATIONAL_COLORS = {
  EXCELLENT: {
    text: 'text-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  GOOD: {
    text: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
  },
  POOR: {
    text: 'text-rose-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
  },
} as const;
