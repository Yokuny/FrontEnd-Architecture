export type EventColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'stone'
  | 'muted';

export type EventType = 'teamChange' | 'maintenance' | 'event';

export interface CalendarMachine {
  id: string;
  name: string;
}

export interface PartialSchedule {
  id: string;
  _id?: string; // Compatibility with legacy or random IDs
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  eventType: EventType | { value: EventType };
  idEnterprise: string;
  desc?: string;
  color?: string;

  // Specific to teamChange and event
  users?: any[];
  repeat?: any;
  notifications?: any;
  observation?: string;

  // Specific to teamChange
  machine?: CalendarMachine;
  date?: string | Date;
  qlp?: { value: string; label: string } | null;
  local?: string;
  idMachine?: string;

  // Specific to maintenance
  dateDoneInit?: string;
  dateDoneEnd?: string;
  datePlanInit?: string;
  datePlanEnd?: string;
  dateWindowInit?: string;
  dateWindowEnd?: string;
  idMaintenancePlan?: string;
}

export type CalendarView = 'month' | 'week';

export interface CalendarFilterParams {
  idEnterprise: string;
  month?: string;
  year?: string;
  day?: string;
  idMachine?: string[];
  idMaintenancePlan?: string[];
  eventType?: EventType;
  managers?: string[];
  status?: 'late' | 'next';
}
