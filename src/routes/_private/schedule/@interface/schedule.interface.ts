import type { CalendarView } from '@/lib/interfaces/schedule.interface';

export type CustomDateRange = { from: Date; to: Date };

export interface ScheduleApiParams {
  currentDate: Date;
  view: CalendarView;
  customDateRange: CustomDateRange | null;
  selectedRoomID: string;
}
