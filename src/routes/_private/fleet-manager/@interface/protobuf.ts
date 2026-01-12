export interface FleetPoint {
  date: Date;
  idMachine: string;
  idSensor: string;
  position: [number, number];
}

export interface FleetCourse {
  date: Date;
  idMachine: string;
  idSensor: string;
  course: number;
}

export interface FleetPositionsCollection {
  positions: FleetPoint[];
  courses: FleetCourse[];
}
