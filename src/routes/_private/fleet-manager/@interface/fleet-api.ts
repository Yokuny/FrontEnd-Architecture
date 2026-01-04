export interface FleetMachine {
  machine: {
    id: string;
    name: string;
    code?: string;
  };
  lastPosition?: {
    lat: number;
    lon: number;
    timestamp: number;
  };
  status?: string;
}

export interface FleetVoyage {
  id: string;
  code: string;
  dateTimeStart: string;
  dateTimeEnd?: string;
  machine?: {
    id: string;
    name: string;
  };
  portPointStart?: {
    code: string;
    description: string;
  };
  portPointEnd?: {
    code: string;
    description: string;
  };
}

export interface FleetVoyagesResponse {
  data: FleetVoyage[];
  pageInfo: Array<{
    count: number;
    page: number;
    size: number;
  }>;
}
