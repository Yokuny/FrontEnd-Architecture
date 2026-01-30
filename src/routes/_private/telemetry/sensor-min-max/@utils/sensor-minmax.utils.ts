import { SORT_PRIORITY_TYPES } from '../@consts/sensor-types.consts';
import type { SensorData } from '../@interface/sensor-minmax.types';

/**
 * Sort sensors by type priority and then by label
 */
export function sortSensorsByPriority(sensors: SensorData[]): SensorData[] {
  return [...sensors].sort((a, b) => {
    const getPriority = (type?: string): number => {
      if (type && SORT_PRIORITY_TYPES.includes(type as (typeof SORT_PRIORITY_TYPES)[number])) return 0;
      if (!type) return 1;
      return 2;
    };

    const prioA = getPriority(a.type);
    const prioB = getPriority(b.type);
    if (prioA !== prioB) return prioA - prioB;
    return (a.label || '').localeCompare(b.label || '');
  });
}

/**
 * Format number with decimal places for display
 */
export function formatSensorValue(value: number | undefined, type?: string): string {
  if (value === undefined || value === null) return '';
  if (['decimal', 'double'].includes(type || '')) {
    return value.toFixed(2);
  }
  return String(value);
}

/**
 * Extract unique units from sensor data
 */
export function extractUniqueUnits(sensors: SensorData[]): string[] {
  const units = new Set(sensors.map((s) => s.unit).filter(Boolean));
  return Array.from(units) as string[];
}
