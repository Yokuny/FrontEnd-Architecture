export interface ConsumptionComparativeData {
  machine: {
    id: string;
    name: string;
    image?: {
      url: string;
    };
  };
  consumptionSources: {
    manual: ConsumptionSourceValue;
    telemetry: ConsumptionSourceValue;
    sounding?: ConsumptionSourceValue;
    flowmeter?: ConsumptionSourceValue;
  };
}

export interface ConsumptionSourceValue {
  value: number;
  unit: string;
}

export interface TimeSeriesReading {
  timestamp: string | number;
  consumptionManual: { value: number };
  consumptionTelemetry: { value: number };
}

export interface ConsumptionComparativeFilters {
  dateMin?: string;
  dateMax?: string;
  unit?: string;
  viewType?: 'consumption' | 'stock';
  idEnterprise?: string;
  machines?: string;
}
