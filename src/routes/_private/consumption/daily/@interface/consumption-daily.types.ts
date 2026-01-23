export interface ConsumptionDailyData {
  _id: string;
  idMachine: string;
  idEnterprise: string;
  date: string;
  hours: number;
  consumption?: ConsumptionValue;
  consumptionReal?: ConsumptionValue;
  pollingEnd?: PollingItem[];
  pollingStart?: PollingItem[];
  pollingStartDateTime?: string;
  pollingEndDateTime?: string;
  distance?: number;
  oil?: OilData;
  engines?: EngineConsumption[];
  isNeedRegeneration?: boolean;
  status?: 'processing' | 'processed';
}

export interface ConsumptionValue {
  value: number;
  unit: string;
  co2: number;
}

export interface PollingItem {
  description: string;
  value: number;
  unit: string;
}

export interface OilData {
  stock: number;
  received: number;
  unit: string;
}

export interface EngineConsumption {
  description: string;
  consumption: ConsumptionValue;
}

export interface UpdateOilPayload {
  idMachine: string;
  newOilReceived: number;
  _id: string;
  idEnterprise: string;
}

export interface UpdatePollingPayload {
  idMachine: string;
  newStartDate?: string;
  newEndDate?: string;
  _id: string;
  idEnterprise: string;
  timezone: string;
}
