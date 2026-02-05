'use client';

import { eachDayOfInterval, endOfMonth, endOfWeek, getDay, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { type CSSProperties, type MouseEvent, useEffect, useMemo, useState } from 'react';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/formatDate';
import { DefaultStartHour, EventGap, EventHeight } from '../@consts/calendar';
import { useEventVisibility } from '../@hooks/use-event-visibility';
import type { PartialSchedule } from '../@interface/schedule';
import { getAllEventsForDay, getEventsForDay, getSpanningEventsForDay, sortEvents } from '../@utils/calendar.utils';
import { EventItem } from './Event';

const Header = () => {
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, []);

  return (
    <Item variant="outline" className="w-full rounded-none border-accent border-x-0 border-t-0 bg-secondary p-0 text-muted-foreground" size="sm">
      <ItemContent className="grid grid-cols-7 flex-row">
        {weekDays.map((day, index) => (
          <ItemContent key={`${index}${day.toString()}month-header-`} className="flex items-center justify-center border-r py-3 last:border-r-0">
            <ItemTitle className="font-semibold text-xs">
              <span className="sm:hidden">{formatDate(day, 'EEEEE')}</span>
              <span className="max-sm:hidden">{formatDate(day, 'EEEE')}</span>
            </ItemTitle>
          </ItemContent>
        ))}
      </ItemContent>
    </Item>
  );
};

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

  const handleEventClick = (event: PartialSchedule, e: MouseEvent) => {
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
    <ItemContent
      data-slot="month-view"
      className="h-full overflow-hidden rounded-md border"
      style={
        {
          '--event-height': `${EventHeight}px`,
          '--event-gap': `${EventGap}px`,
        } as CSSProperties
      }
    >
      <Header />
      <ScrollArea className="md:h-[calc(100vh-13.3rem)]">
        <ItemContent className="grid auto-rows-fr gap-0 p-0">
          {weeks.map((week, weekIndex) => (
            <ItemContent key={`${weekIndex}${week}`} className="grid grid-cols-7 flex-row gap-0 p-0 [&:last-child>*]:border-b-0">
              {week.map((day, dayIndex) => {
                if (!day) return null;
                const dayEvents = getEventsForDay(events, day);
                const spanningEvents = getSpanningEventsForDay(events, day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSunday = getDay(day) === 0;
                const allDayEvents = [...spanningEvents, ...dayEvents];
                const allEvents = getAllEventsForDay(events, day);
                const isReferenceCell = weekIndex === 0 && dayIndex === 0;

                // Fallback to total events if not yet measured or not mounted
                const visibleCount = isMounted ? getVisibleEventCount(allDayEvents.length) : allDayEvents.length;
                const hasMore = visibleCount !== undefined && allDayEvents.length > visibleCount;
                const remainingCount = hasMore ? allDayEvents.length - visibleCount : 0;
                return (
                  <Item
                    key={day.toString()}
                    className="group min-h-[120px] items-start rounded-none border-accent border-r border-b p-1 last:border-r-0 data-outside-cell:bg-secondary data-outside-cell:text-muted-foreground"
                    data-today={isToday(day) || undefined}
                    data-outside-cell={!isCurrentMonth || (isSunday && dayIndex === 6) || undefined}
                    onClick={() => {
                      const start = new Date(day);
                      start.setHours(DefaultStartHour, 0, 0);
                      onEventCreate(start);
                    }}
                  >
                    <ItemContent className="w-full">
                      <ItemHeader className="basis-auto justify-start">
                        <ItemTitle className="inline-flex size-5 items-center justify-center rounded-full font-mono text-xs group-data-today:bg-sky-blue group-data-today:font-bold group-data-today:text-white dark:group-data-today:bg-dark-blue">
                          {formatDate(day, 'd')}
                        </ItemTitle>
                      </ItemHeader>
                      <ItemContent
                        ref={isReferenceCell ? contentRef : null}
                        className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                      >
                        {sortEvents(allDayEvents).map((event, index) => {
                          const eventStart = new Date(event.start);
                          const eventEnd = new Date(event.end);
                          const isFirstDay = isSameDay(day, eventStart);
                          const isLastDay = isSameDay(day, eventEnd);
                          const isHidden = visibleCount !== undefined && index >= visibleCount;

                          return (
                            <ItemContent key={`${dayIndex}${event._id || event.id}`} className="aria-hidden:hidden" aria-hidden={isHidden ? 'true' : undefined}>
                              <EventItem onClick={(e) => handleEventClick(event, e)} event={event} view="month" isFirstDay={isFirstDay} isLastDay={isLastDay}>
                                {!isFirstDay && (
                                  <ItemContent className="invisible" aria-hidden={true}>
                                    {!event.allDay && <span>{formatDate(new Date(event.start), 'h:mm')} </span>}
                                    {event.title}
                                  </ItemContent>
                                )}
                              </EventItem>
                            </ItemContent>
                          );
                        })}

                        {hasMore && (
                          <Popover modal>
                            <PopoverTrigger asChild>
                              <ItemContent
                                className="mt-(--event-gap) h-(--event-height) w-full cursor-pointer select-none items-center gap-1 overflow-hidden px-1 text-left text-[10px] text-muted-foreground outline-none backdrop-blur-md transition hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                + {remainingCount} <span className="max-sm:sr-only">Ver tudo</span>
                              </ItemContent>
                            </PopoverTrigger>
                            <PopoverContent align="center" className="max-w-52 p-3" style={{ '--event-height': `${EventHeight}px` } as CSSProperties}>
                              <ItemContent className="gap-2">
                                <ItemTitle className="text-sm">{formatDate(day, 'd MMMM, EEE')}</ItemTitle>
                                <ItemContent className="gap-1">
                                  {sortEvents(allEvents).map((event) => {
                                    const eventStart = new Date(event.start);
                                    const eventEnd = new Date(event.end || event.start);
                                    const isFirstDay = isSameDay(day, eventStart);
                                    const isLastDay = isSameDay(day, eventEnd);
                                    return (
                                      <EventItem
                                        key={event._id || event.id}
                                        onClick={(e) => handleEventClick(event, e)}
                                        event={event}
                                        view="month"
                                        isFirstDay={isFirstDay}
                                        isLastDay={isLastDay}
                                      />
                                    );
                                  })}
                                </ItemContent>
                              </ItemContent>
                            </PopoverContent>
                          </Popover>
                        )}
                      </ItemContent>
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemContent>
          ))}
        </ItemContent>
      </ScrollArea>
    </ItemContent>
  );
}

type MonthViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
  onEventCreate: (start: Date) => void;
};
