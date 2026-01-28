/**
 * Ponto de dado de um sensor em uma série temporal
 */
export interface SensorDataPoint {
  timestamp: number;
  value: number;
}

/**
 * Série temporal de um sensor
 */
export interface SensorDataSeries {
  name: string;
  sensorId: string;
  data: SensorDataPoint[];
}

/**
 * Opção de intervalo para filtro
 */
export interface IntervalOption {
  value: number;
  label: string;
}

/**
 * Sensor disponível para seleção
 */
export interface SensorOption {
  id: string;
  sensor: string;
  sensorId: string;
  type?: string;
}
