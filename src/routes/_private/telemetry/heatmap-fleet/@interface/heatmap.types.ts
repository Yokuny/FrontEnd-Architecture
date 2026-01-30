export interface SubgroupData {
  subgroupName: string;
  idSensorOnOff?: string;
  isOn?: boolean;
  isDanger?: boolean;
  isWarning?: boolean;
  sensors?: Array<Record<string, any>>;
}

export interface EquipmentData {
  code: string;
  name: string;
  index: number;
  subgroups: SubgroupData[];
  options?: string[];
}

export interface HeatmapFleetItem {
  id: string;
  machine: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  lastUpdate?: string;
  equipments: EquipmentData[];
}

export interface HeatmapStats {
  onlineAssets: number;
  offlineAssets: number;
  itemsOk: number;
  itemsInProgress: number;
  itemsInAlert: number;
}

// Configuration types for add/edit functionality
export interface MachineSensor {
  id: string;
  sensorId: string;
  sensor: string;
  type: string;
}

export interface SubgroupConfig {
  index: number;
  subgroupName: string;
  idSensorOnOff?: string;
  sensors?: Array<{ sensorKey: string }>;
}

export interface EquipmentConfig {
  name: string;
  code: string;
  subgroups: SubgroupConfig[];
}

export interface HeatmapConfigRequest {
  id?: string;
  idEnterprise: string;
  idMachine: string;
  equipments: EquipmentConfig[];
}

export interface HeatmapConfigResponse {
  id: string;
  enterprise?: {
    id: string;
    name: string;
  };
  machine?: {
    id: string;
    name: string;
  };
  equipments: EquipmentConfig[];
}

export interface HeatmapResponse {
  data: HeatmapFleetItem[];
}

export interface EquipmentType {
  index: number;
  name: string;
  code: string;
  subgroups: Array<{ subgroupName: string }>;
  options?: string[];
}

export interface HeatmapAlert {
  idSensor: string;
  idAlert: string;
  minValue?: number;
  maxValue?: number;
  onOffValue?: 'on' | 'off';
  alertMin: boolean;
  alertMax: boolean;
  alertOnOff: boolean;
  idMachine?: string;
}

export interface HeatmapAlertsResponse {
  idMachine: string;
  alerts: HeatmapAlert[];
}
