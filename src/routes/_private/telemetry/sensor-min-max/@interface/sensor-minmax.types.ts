export interface SensorData {
  id: string;
  idSensor: string;
  label: string;
  type?: string;
  unit?: string;
  min?: number;
  max?: number;
}

export interface SensorMinMaxConfig {
  idSensor: string;
  min?: number | null;
  max?: number | null;
  isAlert?: boolean;
  booleanNotify?: boolean | null;
}

export interface SensorMinMaxData {
  id?: string;
  idAsset: string;
  idEnterprise: string;
  sensors: SensorMinMaxConfig[];
}

export interface SensorMinMaxState {
  [idSensor: string]: SensorMinMaxConfig;
}
