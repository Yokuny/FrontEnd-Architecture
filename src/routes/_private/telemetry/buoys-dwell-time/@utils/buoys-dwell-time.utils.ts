import type { BuoyLocation } from '../@interface/buoys-dwell-time.types';

/**
 * Calculate time difference between inAt and outAt in hours
 */
export function calculateTimeDifference(inAt: string, outAt?: string): string {
  if (!outAt) return '-';

  const inDate = new Date(inAt);
  const outDate = new Date(outAt);
  const diffMs = outDate.getTime() - inDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours.toFixed(2);
}

/**
 * Calculate total time spent across all dwell times in hours
 */
export function calculateTotalTimeSpent(dwellTimes: { inAt: string; outAt?: string }[]): string {
  let totalHours = 0;

  for (const dt of dwellTimes) {
    if (dt.outAt) {
      const inDate = new Date(dt.inAt);
      const outDate = new Date(dt.outAt);
      const diffMs = outDate.getTime() - inDate.getTime();
      totalHours += diffMs / (1000 * 60 * 60);
    }
  }

  return totalHours.toFixed(2);
}

/**
 * Get delimitation name by ID from location array
 */
export function getDelimitationName(location: BuoyLocation[] | undefined, idDelimitation: string): string {
  if (!location) return '-';
  const found = location.find((area) => area.idDelimitation === idDelimitation);
  return found?.name || '-';
}
