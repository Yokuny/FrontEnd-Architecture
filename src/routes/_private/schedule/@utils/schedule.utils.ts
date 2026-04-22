import { addDays, addHours, areIntervalsOverlapping, endOfDay, endOfMonth, endOfWeek, getHours, getMinutes, isSameDay, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { StartHour, WeekCellsHeight } from '@/lib/config/calendar.config';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import type { CalendarView, PartialSchedule } from '@/lib/interfaces/schedule.interface';
import type { CustomDateRange, PositionedEvent } from '../@interface/schedule.interface';

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

export function computePositionedEvents(events: PartialSchedule[], day: Date): PositionedEvent[] {
  const dayStart = startOfDay(day);
  const positionedEvents: PositionedEvent[] = [];
  const columns: { event: PartialSchedule; end: Date }[][] = [];

  events.forEach((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end || event.start);
    const adjustedStart = isSameDay(day, eventStart) ? eventStart : dayStart;
    const adjustedEnd = isSameDay(day, eventEnd) ? eventEnd : addHours(dayStart, 24);

    const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
    const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;
    const top = (startHour - StartHour) * WeekCellsHeight;
    const height = (endHour - startHour) * WeekCellsHeight;

    let columnIndex = 0;
    let placed = false;
    while (!placed) {
      const col = columns[columnIndex] || [];
      if (col.length === 0) {
        columns[columnIndex] = col;
        placed = true;
      } else {
        const overlaps = col.some((c) => areIntervalsOverlapping({ start: adjustedStart, end: adjustedEnd }, { start: new Date(c.event.start), end: new Date(c.event.end) }));
        if (!overlaps) placed = true;
        else columnIndex++;
      }
    }

    const currentColumn = columns[columnIndex] || [];
    columns[columnIndex] = currentColumn;
    currentColumn.push({ event, end: adjustedEnd });

    positionedEvents.push({
      event,
      top,
      height,
      left: columnIndex === 0 ? 0 : columnIndex * 0.1,
      width: columnIndex === 0 ? 1 : 0.9,
      zIndex: 10 + columnIndex,
    });
  });

  return positionedEvents;
}

export function snapToQuarterHour(date: Date, time?: number): Date {
  const result = new Date(date);
  if (time !== undefined) {
    const hours = Math.floor(time);
    const frac = time - hours;
    const minutes = frac < 0.125 ? 0 : frac < 0.375 ? 15 : frac < 0.625 ? 30 : 45;
    result.setHours(hours, minutes, 0, 0);
  } else {
    const m = result.getMinutes();
    const rem = m % 15;
    result.setMinutes(rem < 7.5 ? m - rem : m + (15 - rem), 0, 0);
  }
  return result;
}
