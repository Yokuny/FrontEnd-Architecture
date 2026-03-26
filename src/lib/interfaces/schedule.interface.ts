export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
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
type FinancialStatus = 'pending' | 'partial' | 'paid' | 'refund' | 'canceled';
type ScheduleStatus = 'pending' | 'waiting' | 'confirmed' | 'completed' | 'in_progress' | 'no_show' | 'canceled' | 'canceled_by_patient' | 'canceled_by_professional';

export type PartialSchedule = {
  _id: string;
  Patient?: string;
  Professional?: string;
  Room: string;
  title?: string;
  allDay?: boolean;
  start: Date;
  end: Date;
  status: ScheduleStatus;
  color?: EventColor;
};

export type DbSchedule = {
  _id: string;
  Clinic: string;
  Patient?: string;
  Professional?: string;
  Financial?: string;
  Room: string;
  title?: string;
  allDay?: boolean;
  start: Date | string;
  end: Date | string;
  googleEventID?: string;
  status: ScheduleStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type FullSchedule = DbSchedule & {
  financial: {
    _id: string;
    procedures: {
      procedure: string;
      price: number;
      status: FinancialStatus;
    }[];
    price: number;
    paid?: number;
    paymentMethod?: string;
    installments?: number;
    status: ScheduleStatus;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type ScheduleConfirmationData = {
  _id: string;
  patientName: string;
  professionalName: string;
  procedures: string[];
  start: Date;
  end?: Date;
};

export type CalendarProps = {
  now: Date;
  events?: PartialSchedule[];
};
