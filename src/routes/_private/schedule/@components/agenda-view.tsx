import { addDays, isToday } from 'date-fns';
import { useMemo } from 'react';
import Calender from '@/components/icons/Calender.Icon';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgendaDaysToShow } from '@/lib/config/calendar.config';
import { getAgendaEventsForDay } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import type { AgendaViewProps } from '../@interface/schedule.interface';
import { EventItem } from './event-item';

export function AgendaView({ currentDate, events, onEventSelect }: AgendaViewProps) {
  const days = useMemo(() => {
    return Array.from({ length: AgendaDaysToShow }, (_, i) => addDays(new Date(currentDate), i));
  }, [currentDate]);

  const handleEventClick = (event: PartialSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const hasEvents = days.some((day) => getAgendaEventsForDay(events, day).length > 0);

  return (
    <div className="flex h-full flex-col px-4">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <Calender className="mb-2 size-10 text-muted-foreground" />
          <ItemTitle>{t('agenda.empty')}</ItemTitle>
          <ItemDescription>{t('agenda.period.empty')}</ItemDescription>
        </div>
      ) : (
        <ScrollArea className="md:h-[calc(100vh-10.7rem)]">
          <div>
            {days.map((day) => {
              const dayEvents = getAgendaEventsForDay(events, day);
              if (dayEvents.length === 0) return null;

              return (
                <div key={day.toString()} className="relative my-12 border-accent border-t">
                  <span
                    className="absolute -top-3 left-0 flex h-6 items-center bg-background pe-4 text-muted-foreground text-xs data-today:font-semibold sm:pe-4 md:text-sm"
                    data-today={isToday(day) || undefined}
                  >
                    {formatDate(day, 'd MMM, EEEE')}
                  </span>
                  <div className="mt-6 space-y-2">
                    {dayEvents.map((event) => (
                      <EventItem key={event._id} event={event} view="agenda" onClick={(e) => handleEventClick(event, e)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
