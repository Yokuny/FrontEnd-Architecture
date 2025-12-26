export interface MonitoringWearMachine {
  machine: {
    id: string;
    name: string;
    image: {
      url: string;
    } | null;
  };
  enterprise: {
    id: string;
    name: string;
  };
}

export interface MonitoringWearPart {
  idMachine: string;
  part: {
    id: string;
    name: string;
    sku: string;
    image: {
      url: string;
    } | null;
  };
  typeService: {
    id: string;
    description: string;
  };
  wearConfig: {
    id: string;
    proportional: number | null;
    actions: Array<{
      typeService: {
        value: string;
      };
      valueCycle: number;
      unityCycle: string;
    }>;
  };
  wear: number;
  percentual: number;
  lastWearDone: number;
  lastModified: string;
}

export interface MonitoringWearResponse {
  data: MonitoringWearMachine[];
  pageInfo: Array<{ count: number }>;
}
