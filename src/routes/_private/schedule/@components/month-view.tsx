import { eachDayOfInterval, endOfMonth, endOfWeek, getDay, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { useEventVisibility } from '@/hooks/use-event-visibility';
import { DefaultStartHour, EventGap, EventHeight } from '@/lib/config/calendar.config';
import { getAllEventsForDay, getEventsForDay, getSpanningEventsForDay, sortEvents } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import type { MonthViewProps } from '../@interface/schedule.interface';
import { DraggableEvent } from './draggable-event';
import { EventItem } from './event-item';
import { DroppableCell } from './square';

function Header() {
  return (
    <div className="grid grid-cols-7 border-accent border-b font-semibold text-muted-foreground text-xs">
      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, index) => (
        <div key={day} className="flex justify-center py-3">
          <span>{day}</span>
          <span className="sr-only sm:not-sr-only">{['eg', 'er', 'ua', 'ui', 'ex', 'ab', 'om'][index]}</span>
        </div>
      ))}
    </div>
  );
}

export function MonthView({ currentDate, events, onEventSelect, onEventCreate }: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let week: Date[] = [];
    for (let i = 0; i < days.length; i++) {
      week.push(days[i] as Date);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }
    return result;
  }, [days]);

  const handleEventClick = (event: PartialSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const [isMounted, setIsMounted] = useState(false);
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div data-slot="month-view" className="flex h-full flex-col">
      <Header />
      <ScrollArea className="md:h-[calc(100vh-13.3rem)]">
        <div className="grid auto-rows-fr">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-cols-7 [&:last-child>*]:border-b-0">
              {week.map((day, dayIndex) => {
                if (!day) return null;
                const dayEvents = getEventsForDay(events, day);
                const spanningEvents = getSpanningEventsForDay(events, day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSunday = getDay(day) === 0;
                const cellId = `month-cell-${day.toISOString()}`;
                const allDayEvents = [...spanningEvents, ...dayEvents];
                const allEvents = getAllEventsForDay(events, day);
                const isReferenceCell = weekIndex === 0 && dayIndex === 0;
                const visibleCount = isMounted ? getVisibleEventCount(allDayEvents.length) : undefined;
                const hasMore = visibleCount !== undefined && allDayEvents.length > visibleCount;
                const remainingCount = hasMore ? allDayEvents.length - visibleCount : 0;
                return (
                  <div
                    key={day.toString()}
                    className="group border-accent border-r border-b last:border-r-0 data-outside-cell:bg-accent/50 data-outside-cell:text-muted-foreground"
                    data-today={isToday(day) || undefined}
                    data-outside-cell={!isCurrentMonth || (isSunday && dayIndex === 6) || undefined}
                  >
                    <DroppableCell
                      id={cellId}
                      date={day}
                      onClick={() => {
                        const start = new Date(day);
                        start.setHours(DefaultStartHour, 0, 0);
                        onEventCreate(start);
                      }}
                    >
                      <div className="inline-flex size-5 items-center justify-center rounded-full font-mono text-xs group-data-today:bg-sky-blue group-data-today:font-bold group-data-today:text-white dark:group-data-today:bg-dark-blue">
                        {formatDate(day, 'd')}
                      </div>
                      <div
                        ref={isReferenceCell ? contentRef : null}
                        className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                      >
                        {sortEvents(allDayEvents).map((event, index) => {
                          const eventStart = new Date(event.start);
                          const eventEnd = new Date(event.end);
                          const isFirstDay = isSameDay(day, eventStart);
                          const isLastDay = isSameDay(day, eventEnd);
                          const isHidden = isMounted && visibleCount && index >= visibleCount;
                          if (!visibleCount) return null;
                          if (!isFirstDay) {
                            return (
                              <div key={`spanning-${event._id}-${day.toISOString().slice(0, 10)}`} className="aria-hidden:hidden" aria-hidden={isHidden ? 'true' : undefined}>
                                <EventItem onClick={(e) => handleEventClick(event, e)} event={event} view="month" isFirstDay={isFirstDay} isLastDay={isLastDay}>
                                  <div className="invisible" aria-hidden={true}>
                                    {!event.allDay && <span>{formatDate(new Date(event.start), 'h:mm')} </span>}
                                    {event.title}
                                  </div>
                                </EventItem>
                              </div>
                            );
                          }

                          return (
                            <div key={event._id} className="aria-hidden:hidden" aria-hidden={isHidden ? 'true' : undefined}>
                              <DraggableEvent event={event} view="month" onClick={(e) => handleEventClick(event, e)} isFirstDay={isFirstDay} isLastDay={isLastDay} />
                            </div>
                          );
                        })}

                        {hasMore && (
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <UnstyledButton
                                className="mt-[var(--event-gap)] flex h-[var(--event-height)] w-full select-none items-center gap-1 overflow-hidden px-1 text-left text-[10px] text-muted-foreground outline-none backdrop-blur-md transition hover:bg-accent hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                + {remainingCount} <span className="max-sm:sr-only">Ver tudo</span>
                              </UnstyledButton>
                            </PopoverTrigger>
                            <PopoverContent align="center" className="max-w-52 p-3" style={{ '--event-height': `${EventHeight}px` } as React.CSSProperties}>
                              <div className="space-y-2">
                                <p className="font-semibold text-sm">{formatDate(day, 'd MMMM, EEE')}</p>
                                <div className="space-y-1">
                                  {sortEvents(allEvents).map((event) => {
                                    const eventStart = new Date(event.start);
                                    const eventEnd = new Date(event.end || event.start);
                                    const isFirstDay = isSameDay(day, eventStart);
                                    const isLastDay = isSameDay(day, eventEnd);
                                    return (
                                      <EventItem
                                        key={event._id}
                                        onClick={(e) => handleEventClick(event, e)}
                                        event={event}
                                        view="month"
                                        isFirstDay={isFirstDay}
                                        isLastDay={isLastDay}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </DroppableCell>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
