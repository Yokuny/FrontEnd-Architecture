export interface PeriodOption {
  value: number;
  label: string;
}

export interface SensorOption {
  value: string;
  label: string;
  title?: string;
}

/**
 * Performance data returned from API
 * data is a matrix where each row is [timestamp, sensorX_value, sensorY1_value, sensorY2_value, ...]
 */
export interface PerformanceData {
  data: number[][];
}

export interface ScatterDataPoint {
  x: number;
  y: number;
}
