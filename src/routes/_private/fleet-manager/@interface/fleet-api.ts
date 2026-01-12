export interface FleetMachine {
  onlyMachine?: boolean;
  machine: {
    id: string;
    name: string;
    code?: string;
    image?: { url: string };
    dataSheet?: any;
  };
  modelMachine?: {
    description: string;
    typeMachine: string;
    color: string;
    icon?: { url: string };
  };
  config?: {
    idSensorCoordinate: string;
    idSensorCourse: string;
    idSensorHeading: string;
    idSensorSpeed: string;
    idSensorDraught?: string;
    idSensorDestiny?: string;
    idSensorETA?: string;
    idSensorStatusNavigation?: string;
    unitySpeed?: string;
  };
  lastState?: {
    coordinate?: [number, number];
    course?: number;
    speed?: number;
    heading?: number;
    date?: string;
    eta?: string;
    destiny?: string;
    statusNavigation?: string;
    draught?: number;
  };
  status?: string;
}

export interface FleetPortPoint {
  code: string;
  description: string;
  coordinate?: {
    latitude: number;
    longitude: number;
  };
}

export interface FleetVoyage {
  id: string;
  code: string;
  dateTimeStart: string;
  dateTimeEnd?: string;
  machine?: {
    id: string;
    name: string;
    image?: { url: string };
  };
  portPointStart?: FleetPortPoint;
  portPointEnd?: FleetPortPoint;
  portPointDestiny?: FleetPortPoint;
  metadata?: {
    eta?: string;
    dateTimeArrival?: string;
    freshWaterArrival?: number;
    freshWaterDeparture?: number;
    lubricantArrival?: number;
    lubricantDeparture?: number;
    formsInPort?: any[];
    formsInVoyage?: any[];
  };
  consumeIFO?: number;
  consumeMDO?: number;
  distance?: number;
  loadWeight?: number;
  loadValue?: number;
  freightCost?: number;
  status?: string;
}

export interface FleetVoyagesResponse {
  data: FleetVoyage[];
  pageInfo: Array<{
    count: number;
    page: number;
    size: number;
  }>;
}

export interface MachineDetailsResponse {
  data: {
    eta?: string;
    position?: [number, number];
    destiny?: string;
    speed?: number;
    unitySpeed?: string;
    draught?: number;
    consume?: number;
    status?: string | number;
    course?: number;
    lastUpdate?: string;
  };
  travel?: FleetVoyage;
}

export interface VoyageAnalyticsResponse {
  data: Array<{
    value: number;
    description: string;
    unit?: string;
  }>;
}

export interface TimelineEvent {
  id: string;
  type: string;
  date: string;
  data: {
    status?: string;
    dateTimeStart?: string;
    dateTimeEnd?: string;
    idFence?: string;
    [key: string]: any;
  };
  machine?: {
    id: string;
    name: string;
  };
  geofenceStart?: {
    id: string;
    description: string;
  };
  geofenceEnd?: {
    id: string;
    description: string;
  };
  geofence?: {
    id: string;
    description: string;
    code?: string;
  };
}

export interface MachineTimelineResponse {
  data: TimelineEvent[];
  pageInfo: Array<{
    count: number;
    page: number;
    size: number;
  }>;
}

export type SpeedHistoryResponse = Array<[number, number]>; // [timestamp, speed]

export interface CrewMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: { url: string };
  isOnlyContact?: boolean;
  boarding?: string;
  landing?: string;
}

export interface CrewResponse {
  totalOnBoard: number;
  people: CrewMember[];
}

export interface MachineContact {
  name: string;
  phone: string;
}

export interface MachineContactsResponse {
  id: string;
  name: string;
  code: string;
  contacts: MachineContact[];
  dataSheet?: {
    managementName?: string;
    [key: string]: any;
  };
}

export interface MachineCamera {
  name: string;
  link: string;
}

export interface LastVoyageResponse extends FleetVoyage {
  itinerary: Array<{
    where: string;
    atd?: string;
    load?: Array<{
      description: string;
      amount: number;
      unit: string;
    }>;
  }>;
}

export interface MachineDatasheet {
  imo?: string;
  mmsi?: string;
  lengthLoa?: number;
  width?: number;
  deadweight?: number;
  grossTonage?: number;
  yearBuild?: number;
  flag?: string;
  [key: string]: any;
}
