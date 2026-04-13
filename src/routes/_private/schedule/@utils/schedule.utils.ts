import { addDays, endOfDay, endOfMonth, endOfWeek, getMinutes, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import type { CalendarView, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import type { CustomDateRange } from '../@interface/schedule.interface';

export function getDateRangeForView(currentDate: Date, view: CalendarView, customDateRange: CustomDateRange | null): { startDate: Date; endDate: Date } {
  if (customDateRange && view === 'agenda') {
    return { startDate: startOfDay(customDateRange.from), endDate: endOfDay(customDateRange.to) };
  }
  const startDate = startOfDay(currentDate);
  const endDate = endOfDay(currentDate);
  if (view === 'month') return { startDate: startOfMonth(startDate), endDate: endOfMonth(endDate) };
  if (view === 'week') return { startDate: startOfWeek(startDate, { weekStartsOn: 1 }), endDate: endOfWeek(endDate, { weekStartsOn: 1 }) };
  if (view === 'day' || view === 'agenda') return { startDate, endDate: addDays(endDate, 1) };
  return { startDate, endDate };
}

export function computeUpcomingPerProfessional(events: PartialSchedule[]): Array<{
  Professional: string;
  nextEvent: PartialSchedule;
}> {
  const now = new Date();
  const professionalEvents = new Map<string, PartialSchedule[]>();
  events.forEach((event) => {
    if (new Date(event.start) > now && event.Professional) {
      const list = professionalEvents.get(event.Professional) || [];
      professionalEvents.set(event.Professional, [...list, event]);
    }
  });
  return Array.from(professionalEvents.entries()).map(([prof, profEvents]) => ({
    Professional: prof,
    nextEvent: profEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0],
  }));
}

export function formatTimeWithOptionalMinutes(date: Date): string {
  return formatDate(date, getMinutes(date) === 0 ? 'ha' : 'h:mma').toLowerCase();
}

export function extractTimeFromISO(iso?: string): string | undefined {
  if (!iso) return undefined;
  return formatDate(iso, 'HH:mm');
}
