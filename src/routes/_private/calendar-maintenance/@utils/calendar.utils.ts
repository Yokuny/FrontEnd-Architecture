import { isBefore, isSameDay } from 'date-fns';
import type { EventColor, PartialSchedule } from '../@interface/schedule';

export const eventColors: { value: EventColor; label: string; color: string }[] = [
  { value: 'red', label: 'Vermelho', color: 'bg-red-500' },
  { value: 'orange', label: 'Laranja', color: 'bg-orange-500' },
  { value: 'amber', label: 'Âmbar', color: 'bg-amber-500' },
  { value: 'yellow', label: 'Amarelo', color: 'bg-yellow-500' },
  { value: 'lime', label: 'Lima', color: 'bg-lime-500' },
  { value: 'green', label: 'Verde', color: 'bg-green-500' },
  { value: 'emerald', label: 'Esmeralda', color: 'bg-emerald-500' },
  { value: 'teal', label: 'Azul-Verde', color: 'bg-teal-500' },
  { value: 'cyan', label: 'Ciano', color: 'bg-cyan-500' },
  { value: 'sky', label: 'Azul Céu', color: 'bg-sky-500' },
  { value: 'blue', label: 'Azul', color: 'bg-blue-500' },
  { value: 'indigo', label: 'Anil', color: 'bg-indigo-500' },
  { value: 'violet', label: 'Violeta', color: 'bg-violet-500' },
  { value: 'purple', label: 'Roxo', color: 'bg-purple-500' },
  { value: 'fuchsia', label: 'Fúcsia', color: 'bg-fuchsia-500' },
  { value: 'pink', label: 'Rosa Claro', color: 'bg-pink-500' },
  { value: 'rose', label: 'Rosa', color: 'bg-rose-500' },
  { value: 'slate', label: 'Ardósia', color: 'bg-slate-500' },
  { value: 'stone', label: 'Pedra', color: 'bg-stone-500' },
];

export function getEventColorClasses(color?: EventColor | string): string {
  const eventColor = color || 'sky';

  switch (eventColor) {
    case 'red':
      return 'bg-red-200/50 hover:bg-red-200/40 text-red-950/80 dark:bg-red-400/25 dark:hover:bg-red-400/20 dark:text-red-200 ';
    case 'orange':
      return 'bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 ';
    case 'amber':
      return 'bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 ';
    case 'yellow':
      return 'bg-yellow-200/50 hover:bg-yellow-200/40 text-yellow-950/80 dark:bg-yellow-400/25 dark:hover:bg-yellow-400/20 dark:text-yellow-200 ';
    case 'lime':
      return 'bg-lime-200/50 hover:bg-lime-200/40 text-lime-950/80 dark:bg-lime-400/25 dark:hover:bg-lime-400/20 dark:text-lime-200 ';
    case 'green':
      return 'bg-green-200/50 hover:bg-green-200/40 text-green-950/80 dark:bg-green-400/25 dark:hover:bg-green-400/20 dark:text-green-200 ';
    case 'emerald':
      return 'bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 ';
    case 'teal':
      return 'bg-teal-200/50 hover:bg-teal-200/40 text-teal-950/80 dark:bg-teal-400/25 dark:hover:bg-teal-400/20 dark:text-teal-200 ';
    case 'cyan':
      return 'bg-cyan-200/50 hover:bg-cyan-200/40 text-cyan-950/80 dark:bg-cyan-400/25 dark:hover:bg-cyan-400/20 dark:text-cyan-200 ';
    case 'sky':
      return 'bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 ';
    case 'blue':
      return 'bg-blue-200/50 hover:bg-blue-200/40 text-blue-950/80 dark:bg-blue-400/25 dark:hover:bg-blue-400/20 dark:text-blue-200 ';
    case 'indigo':
      return 'bg-indigo-200/50 hover:bg-indigo-200/40 text-indigo-950/80 dark:bg-indigo-400/25 dark:hover:bg-indigo-400/20 dark:text-indigo-200 ';
    case 'violet':
      return 'bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 ';
    case 'purple':
      return 'bg-purple-200/50 hover:bg-purple-200/40 text-purple-950/80 dark:bg-purple-400/25 dark:hover:bg-purple-400/20 dark:text-purple-200 ';
    case 'fuchsia':
      return 'bg-fuchsia-200/50 hover:bg-fuchsia-200/40 text-fuchsia-950/80 dark:bg-fuchsia-400/25 dark:hover:bg-fuchsia-400/20 dark:text-fuchsia-200 ';
    case 'pink':
      return 'bg-pink-200/50 hover:bg-pink-200/40 text-pink-950/80 dark:bg-pink-400/25 dark:hover:bg-pink-400/20 dark:text-pink-200 ';
    case 'rose':
      return 'bg-rose-200/50 hover:bg-rose-200/40 text-rose-950/80 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 ';
    case 'slate':
      return 'bg-slate-200/50 hover:bg-slate-200/40 text-slate-950/80 dark:bg-slate-400/25 dark:hover:bg-slate-400/20 dark:text-slate-200 ';
    case 'stone':
      return 'bg-stone-200/50 hover:bg-stone-200/40 text-stone-950/80 dark:bg-stone-400/25 dark:hover:bg-stone-400/20 dark:text-stone-200 ';
    case 'muted':
      return 'border border-accent bg-slate-200/10 dark:bg-slate-400/10 dark:hover:bg-slate-400/20 text-gray-950/40 dark:text-gray-300 ';
    default:
      return 'bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 ';
  }
}

export function getBorderRadiusClasses(isFirstDay: boolean, isLastDay: boolean): string {
  if (isFirstDay && isLastDay) {
    return 'rounded-md';
  } else if (isFirstDay) {
    return 'rounded-l-md rounded-r-none';
  } else if (isLastDay) {
    return 'rounded-r-md rounded-l-none';
  } else {
    return 'rounded-none';
  }
}

export function isMultiDayEvent(event: PartialSchedule): boolean {
  return event.allDay || !isSameDay(new Date(event.start), new Date(event.end));
}

export function getEventsForDay(events: PartialSchedule[], day: Date): PartialSchedule[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      return isSameDay(day, eventStart);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function sortEvents(events: PartialSchedule[]): PartialSchedule[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a);
    const bIsMultiDay = isMultiDayEvent(b);

    if (aIsMultiDay && !bIsMultiDay) return -1;
    if (!aIsMultiDay && bIsMultiDay) return 1;

    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(events: PartialSchedule[], day: Date): PartialSchedule[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false;

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    // Only include if it's not the start day but is either the end day or a middle day
    return !isSameDay(day, eventStart) && (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd));
  });
}

export function getAllEventsForDay(events: PartialSchedule[], day: Date): PartialSchedule[] {
  return events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd);
  });
}

export function getAgendaEventsForDay(events: PartialSchedule[], day: Date): PartialSchedule[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd);
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export function addHoursToDate(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function capitalizeString(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function transformLegacyEvent(x: any): PartialSchedule {
  const common = {
    id: x.id,
    _id: x._id || x.id,
    idEnterprise: x.idEnterprise,
    eventType: x.eventType,
    machine: x.machine,
    idMachine: x.idMachine,
  };

  if (x.eventType === 'teamChange') {
    return {
      ...common,
      title: x.machine?.name || 'Troca de Equipe',
      desc: 'Troca de Equipe',
      allDay: false,
      start: new Date(x.date),
      end: new Date(x.date),
      date: x.date,
      qlp: x.qlp,
      local: x.local,
      repeat: x.repeat,
      notifications: x.notifications,
      users: x.users,
      color: 'purple',
    };
  }

  if (x.eventType === 'maintenance') {
    const start = x.dateDoneInit || x.datePlanInit || x.dateWindowInit;
    const end = x.dateDoneEnd || x.datePlanEnd || x.dateWindowEnd;
    const today = new Date();

    let color: EventColor = 'sky';
    if (x.dateDoneInit) {
      color = 'green';
    } else if (x.datePlanInit) {
      if (isBefore(new Date(x.datePlanInit), today)) {
        color = 'red';
      } else {
        color = 'slate';
      }
    } else if (x.dateWindowEnd) {
      if (isBefore(new Date(x.dateWindowEnd), today)) {
        color = 'red';
      } else {
        color = 'blue';
      }
    }

    return {
      ...common,
      title: x.machine?.name || 'Manutenção',
      desc: x.maintenancePlan?.description,
      allDay: true,
      start: new Date(start),
      end: end ? new Date(end) : today,
      dateDoneInit: x.dateDoneInit,
      dateDoneEnd: x.dateDoneEnd,
      datePlanInit: x.datePlanInit,
      datePlanEnd: x.datePlanEnd,
      dateWindowInit: x.dateWindowInit,
      dateWindowEnd: x.dateWindowEnd,
      observation: x.observation,
      idMaintenancePlan: x.idMaintenancePlan,
      color,
    };
  }

  // eventType === 'event'
  return {
    ...common,
    title: x.observation || 'Evento',
    desc: 'Evento',
    allDay: false,
    start: new Date(x.date),
    end: new Date(x.date),
    date: x.date,
    users: x.users,
    observation: x.observation,
    repeat: x.repeat,
    notifications: x.notifications,
    color: 'orange',
  };
}
