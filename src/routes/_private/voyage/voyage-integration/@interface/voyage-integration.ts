export interface KickVoyageFilter {
  dateTimeDeparture: string;
  dateTimeArrival: string;
  dateTimeSourceArrival: string;
  dateTimeDestinyDeparture: string;
  index: number;
}

export interface IntegrationAsset {
  idMachine: string;
  machine: {
    name: string;
    code: string;
  };
  vesselType?: string;
  status?: string;
}

export interface IntegrationVoyage {
  idVoyage: string;
  code: string;
  customer?: string;
  loadDescription?: string;
  loadWeight?: number;
  dateTimeStart: string;
  dateTimeEnd: string;
  dateTimeLastArrival?: string;
  portStart?: string;
  portEnd?: string;
  machine?: {
    id: string;
    name: string;
    code?: string;
  };
}

export interface VoyageIntegrationListResponse {
  data: IntegrationVoyage[];
  pageInfo: { count: number }[];
}

export interface VoyageAnalytics {
  distance: number;
  speedAvg: number;
  speedAvgInOcean: number;
  ifo: number;
  ifoPort: number;
  ifoVoyage: number;
  mdo: number;
  lsf: number;
  mgo: number;
  consume?: {
    unit: string;
  };
  inPort?: {
    distanceUnit: string;
    distance: number;
    consume?: {
      ifo: number;
      mdo: number;
      lsf: number;
      mgo: number;
    };
  };
  inVoyage?: {
    distance: number;
    speedAvg: number;
    avgData?: {
      speedInOcean?: {
        distance: number;
        time: number;
      };
      speed?: {
        distance: number;
        time: number;
      };
    };
    consume?: {
      ifo: number;
      mdo: number;
      lsf: number;
      mgo: number;
    };
  };
}

export interface IntegrationVoyageDetail extends IntegrationVoyage {
  analytics: VoyageAnalytics;
  // Add other detail specific fields if needed
}

export interface MachineEventStatus {
  status: string;
  minutes: number;
}

export interface VoyageEvent {
  type: 'init_travel' | 'load' | 'finish_travel' | 'fuel' | 'other';
  description: string;
  dateTimeStart: string;
  dateTimeEnd?: string;
  title?: string;
}
