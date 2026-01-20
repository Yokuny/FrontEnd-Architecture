export interface ConsumptionIntervalData {
  _id: string;
  date: string;
  idMachine: string;
  idEnterprise: string;
  hours: number;
  consumption?: ConsumptionValue;
  consumptionReal?: ConsumptionValue;
  oil?: OilData;
  engines?: EngineConsumption[];
  machine: {
    id: string;
    name: string;
  };
}

export interface ConsumptionValue {
  value: number;
  unit: string;
  co2: number;
  type?: string;
}

export interface OilData {
  stock: number;
  received: number;
  unit: string;
}

export interface EngineConsumption {
  description: string;
  consumption: ConsumptionValue;
  hours: number;
}
