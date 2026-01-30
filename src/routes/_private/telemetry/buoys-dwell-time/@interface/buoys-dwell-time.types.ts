export interface DwellTimeMachine {
  name?: string;
  mmsi?: string;
}

export interface DwellTimeEntry {
  idBuoy: string;
  idDelimitation: string;
  machine?: DwellTimeMachine;
  inAt: string;
  outAt?: string;
}

export interface BuoyLocation {
  idDelimitation: string;
  name: string;
}

export interface Buoy {
  id: string;
  name: string;
  proximity?: string;
  location?: BuoyLocation[];
}

export interface BuoyWithDwellTime extends Buoy {
  dwellTimes: DwellTimeEntry[];
}
