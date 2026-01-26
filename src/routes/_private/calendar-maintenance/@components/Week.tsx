'use client';

import {
  addHours,
  areIntervalsOverlapping,
  differenceInMinutes,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  getDay,
  getHours,
  getMinutes,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { type CSSProperties, type MouseEvent, useMemo } from 'react';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { EndHour, StartHour, WeekCellsHeight } from '../@consts/calendar';
import type { PartialSchedule } from '../@interface/schedule';
import { isMultiDayEvent } from '../@utils/calendar.utils';
import { EventItem } from './Event';

const Header = ({ days }: { days: Date[] }) => {
  return (
    <Item
      variant="outline"
      className="sticky top-0 z-30 grid w-full grid-cols-[4rem_repeat(7,1fr)] rounded-none border-x-0 border-t-0 bg-secondary p-0 font-medium text-muted-foreground text-xs backdrop-blur-md"
      size="sm"
    >
      <ItemContent className="flex items-center justify-center border-r py-2 text-center">
        <ItemTitle className="max-[479px]:sr-only">{formatDate(new Date(), 'O')}</ItemTitle>
      </ItemContent>
      {days.map((day) => (
        <ItemContent
          key={day.toString()}
          className="flex items-center justify-center border-r py-3 text-center last:border-r-0 data-today:font-semibold data-outside-cell:text-muted-foreground data-today:text-primary"
          data-today={isToday(day) || undefined}
          data-outside-cell={(getDay(day) === 0 && days.indexOf(day) === 6) || undefined}
        >
          <ItemTitle className="text-xs">{formatDate(day, 'EEEEEE dd')}</ItemTitle>
        </ItemContent>
      ))}
    </Item>
  );
};

export function WeekView({ currentDate, events, onEventSelect, onEventCreate }: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  // Get all-day events and multi-day events for the week
  const allDayEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Include explicitly marked all-day events or multi-day events
        return event.allDay || isMultiDayEvent(event);
      })
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return days.some((day) => isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd));
      });
  }, [events, days]);

  // Process events for each day to calculate positions
  const processedDayEvents = useMemo(() => {
    const result = days.map((day) => {
      // Get events for this day that are not all-day events or multi-day events
      const dayEvents = events.filter((event) => {
        // Skip all-day events and multi-day events
        if (event.allDay || isMultiDayEvent(event)) return false;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Check if event is on this day
        return isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (eventStart < day && eventEnd > day);
      });

      // Sort events by start time and duration
      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        const aEnd = new Date(a.end);
        const bEnd = new Date(b.end);

        // First sort by start time
        if (aStart < bStart) return -1;
        if (aStart > bStart) return 1;

        // If start times are equal, sort by duration (longer events first)
        const aDuration = differenceInMinutes(aEnd, aStart);
        const bDuration = differenceInMinutes(bEnd, bStart);
        return bDuration - aDuration;
      });

      // Calculate positions for each event
      const positionedEvents: PositionedEvent[] = [];
      const dayStart = startOfDay(day);

      // Track columns for overlapping events
      const columns: { event: PartialSchedule; end: Date }[][] = [];

      sortedEvents.forEach((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Adjust start and end times if they're outside this day
        const adjustedStart = isSameDay(day, eventStart) ? eventStart : dayStart;
        const adjustedEnd = isSameDay(day, eventEnd) ? eventEnd : addHours(dayStart, 24);

        // Calculate top position and height
        const startHour = getHours(adjustedStart) + getMinutes(adjustedStart) / 60;
        const endHour = getHours(adjustedEnd) + getMinutes(adjustedEnd) / 60;

        // Adjust the top calculation to account for the new start time
        const top = (startHour - StartHour) * WeekCellsHeight;
        const height = (endHour - startHour) * WeekCellsHeight;

        // Find a column for this event
        let columnIndex = 0;
        let placed = false;

        while (!placed) {
          const col = columns[columnIndex] || [];
          if (col.length === 0) {
            columns[columnIndex] = col;
            placed = true;
          } else {
            const overlaps = col.some((c) =>
              areIntervalsOverlapping(
                { start: adjustedStart, end: adjustedEnd },
                {
                  start: new Date(c.event.start),
                  end: new Date(c.event.end),
                },
              ),
            );
            if (!overlaps) {
              placed = true;
            } else {
              columnIndex++;
            }
          }
        }

        // Ensure column is initialized before pushing
        const currentColumn = columns[columnIndex] || [];
        columns[columnIndex] = currentColumn;
        currentColumn.push({ event, end: adjustedEnd });

        // Calculate width and left position based on number of columns
        const width = columnIndex === 0 ? 1 : 0.9;
        const left = columnIndex === 0 ? 0 : columnIndex * 0.1;

        positionedEvents.push({
          event,
          top,
          height,
          left,
          width,
          zIndex: 10 + columnIndex, // Higher columns get higher z-index
        });
      });

      return positionedEvents;
    });

    return result;
  }, [days, events]);

  const handleEventClick = (event: PartialSchedule, e: MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const showAllDaySection = allDayEvents.length > 0;

  return (
    <ItemContent
      data-slot="week-view"
      className="h-full overflow-hidden rounded-md border"
      style={
        {
          '--week-cells-height': `${WeekCellsHeight}px`,
        } as CSSProperties
      }
    >
      <Header days={days} />
      {showAllDaySection && (
        <ItemContent className="border-accent border-b bg-muted p-0">
          <ItemContent className="grid grid-cols-[4rem_repeat(7,1fr)] flex-row gap-0 p-0">
            <ItemContent className="flex items-center justify-center border-accent border-r p-1 text-center text-[10px] text-muted-foreground leading-tight sm:text-xs">
              Dia inteiro
            </ItemContent>
            {days.map((day, dayIndex) => {
              const dayAllDayEvents = allDayEvents.filter((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                return isSameDay(day, eventStart) || (day > eventStart && day < eventEnd) || isSameDay(day, eventEnd);
              });

              return (
                <ItemContent
                  key={day.toString()}
                  className="relative border-accent border-r py-0.5 last:border-r-0 data-outside-cell:text-muted-foreground"
                  data-today={isToday(day) || undefined}
                  data-outside-cell={(getDay(day) === 0 && dayIndex === 6) || undefined}
                >
                  {dayAllDayEvents.map((event) => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const isFirstDay = isSameDay(day, eventStart);
                    const isLastDay = isSameDay(day, eventEnd);

                    const isFirstVisibleDay = dayIndex === 0 && isBefore(eventStart, weekStart);
                    const shouldShowTitle = isFirstDay || isFirstVisibleDay;

                    return (
                      <EventItem
                        key={`spanning-${event._id || event.id}`}
                        onClick={(e) => handleEventClick(event, e)}
                        className="md:text-sm"
                        event={event}
                        view="month"
                        isFirstDay={isFirstDay}
                        isLastDay={isLastDay}
                      >
                        <ItemTitle className={cn('truncate leading-none', !shouldShowTitle && 'invisible')} aria-hidden={!shouldShowTitle}>
                          {event.title}
                        </ItemTitle>
                      </EventItem>
                    );
                  })}
                </ItemContent>
              );
            })}
          </ItemContent>
        </ItemContent>
      )}

      <ScrollArea className="md:h-[calc(100vh-13.35rem)]">
        <ItemContent className="grid grid-cols-[4rem_repeat(7,1fr)] gap-0 p-0">
          <ItemContent className="flex flex-col gap-0 border-accent border-r p-0">
            {hours.map((hour, index) => (
              <ItemContent key={hour.toString()} className="relative min-h-(--week-cells-height) border-accent border-b p-0 last:border-b-0">
                {index > 0 && (
                  <ItemTitle className="absolute -top-3 right-0 flex h-6 w-full items-center justify-end px-2 font-normal text-[10px] text-muted-foreground sm:pe-4 sm:text-xs">
                    {formatDate(hour, 'p')}
                  </ItemTitle>
                )}
              </ItemContent>
            ))}
          </ItemContent>
          {days.map((day, dayIndex) => (
            <ItemContent
              key={day.toString()}
              className="relative flex flex-col border-accent border-r p-0 last:border-r-0 data-outside-cell:bg-secondary data-outside-cell:text-muted-foreground"
              data-today={isToday(day) || undefined}
              data-outside-cell={(getDay(day) === 0 && dayIndex === 6) || undefined}
            >
              {(() => {
                const dayEvents = processedDayEvents[dayIndex] ?? [];
                return dayEvents.map((positionedEvent) => (
                  <ItemContent
                    key={positionedEvent.event._id || positionedEvent.event.id}
                    className="absolute z-10 p-0 px-0.5"
                    style={{
                      top: `${positionedEvent.top}px`,
                      height: `${positionedEvent.height}px`,
                      left: `${positionedEvent.left * 100}%`,
                      width: `${positionedEvent.width * 100}%`,
                      zIndex: positionedEvent.zIndex,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ItemContent className="size-full">
                      <EventItem event={positionedEvent.event} view="week" onClick={(e) => handleEventClick(positionedEvent.event, e)} showTime />
                    </ItemContent>
                  </ItemContent>
                ));
              })()}

              {hours.map((hour) => {
                const hourValue = getHours(hour);
                return (
                  <ItemContent key={hour.toString()} className="relative min-h-(--week-cells-height) border-accent border-b p-0 last:border-b-0">
                    {[0, 1, 2, 3].map((quarter) => {
                      return (
                        <ItemContent
                          key={`${hour.toString()}-${quarter}`}
                          className={cn(
                            'absolute h-[calc(var(--week-cells-height)/4)] w-full cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
                            quarter === 0 && 'top-0',
                            quarter === 1 && 'top-[calc(var(--week-cells-height)/4)]',
                            quarter === 2 && 'top-[calc(var(--week-cells-height)/4*2)]',
                            quarter === 3 && 'top-[calc(var(--week-cells-height)/4*3)]',
                          )}
                          onClick={() => {
                            const start = new Date(day);
                            start.setHours(hourValue);
                            start.setMinutes(quarter * 15);
                            onEventCreate(start);
                          }}
                        />
                      );
                    })}
                  </ItemContent>
                );
              })}
            </ItemContent>
          ))}
        </ItemContent>
      </ScrollArea>
    </ItemContent>
  );
}

type WeekViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
  onEventCreate: (start: Date) => void;
};

type PositionedEvent = {
  event: PartialSchedule;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
};
