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
import type React from 'react';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { useCurrentTimeIndicator } from '@/hooks/use-current-time-indicator';
import { EndHour, StartHour, WeekCellsHeight } from '@/lib/config/calendar.config';
import { isMultiDayEvent } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import type { PositionedEvent, WeekViewProps } from '../@interface/schedule.interface';
import { DraggableEvent } from './draggable-event';
import { EventItem } from './event-item';
import { DroppableCell } from './square';

function Header({ days }: { days: Date[] }) {
  return (
    <div className="sticky top-0 z-30 grid grid-cols-8 rounded-t-sm font-medium text-muted-foreground text-xs backdrop-blur-md">
      <div className="py-2 text-center">
        <span className="max-[479px]:sr-only">{formatDate(new Date(), 'O')}</span>
      </div>
      {days.map((day) => (
        <div
          key={day.toString()}
          className="py-3 text-center data-today:font-semibold data-outside-cell:text-muted-foreground data-today:text-sky-blue data-today:dark:text-sky-blue"
          data-today={isToday(day) || undefined}
          data-outside-cell={(getDay(day) === 0 && days.indexOf(day) === 6) || undefined}
        >
          <span>{formatDate(day, 'EEEEEE dd')}</span>
        </div>
      ))}
    </div>
  );
}

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

  const allDayEvents = useMemo(() => {
    return events
      .filter((event) => event.allDay || isMultiDayEvent(event))
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return days.some((day) => isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd));
      });
  }, [events, days]);

  const processedDayEvents = useMemo(() => {
    return days.map((day) => {
      const dayEvents = events.filter((event) => {
        if (event.allDay || isMultiDayEvent(event)) return false;
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return isSameDay(day, eventStart) || isSameDay(day, eventEnd) || (eventStart < day && eventEnd > day);
      });

      const sortedEvents = [...dayEvents].sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        if (aStart < bStart) return -1;
        if (aStart > bStart) return 1;
        return differenceInMinutes(new Date(b.end), bStart) - differenceInMinutes(new Date(a.end), aStart);
      });

      const positionedEvents: PositionedEvent[] = [];
      const dayStart = startOfDay(day);
      const columns: { event: PartialSchedule; end: Date }[][] = [];

      sortedEvents.forEach((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
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
    });
  }, [days, events]);

  const handleEventClick = (event: PartialSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const showAllDaySection = allDayEvents.length > 0;
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(currentDate, 'week');

  return (
    <div data-slot="week-view" className="flex h-full flex-col">
      <Header days={days} />
      {showAllDaySection && (
        <div className="border-accent border-b bg-muted">
          <div className="grid grid-cols-8">
            <div className="flex items-center justify-center border-accent border-r text-center text-muted-foreground text-xs">Dia inteiro</div>
            {days.map((day, dayIndex) => {
              const dayAllDayEvents = allDayEvents.filter((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                return isSameDay(day, eventStart) || (day > eventStart && day < eventEnd) || isSameDay(day, eventEnd);
              });

              return (
                <div
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
                        key={`spanning-${event._id}`}
                        onClick={(e) => handleEventClick(event, e)}
                        className="md:text-sm"
                        event={event}
                        view="month"
                        isFirstDay={isFirstDay}
                        isLastDay={isLastDay}
                      >
                        <div className={cn('truncate', !shouldShowTitle && 'invisible')} aria-hidden={!shouldShowTitle}>
                          {event.title}
                        </div>
                      </EventItem>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ScrollArea className="md:h-[calc(100vh-13.35rem)]">
        <div className="grid grid-cols-8">
          <div className="grid auto-cols-fr border-accent border-r">
            {hours.map((hour, index) => (
              <div key={hour.toString()} className="relative min-h-[var(--week-cells-height)] border-accent border-b last:border-b-0">
                {index > 0 && (
                  <span className="absolute -top-3 left-0 flex h-6 w-14 max-w-full items-center justify-end pe-2 text-[10px] text-muted-foreground sm:pe-4 sm:text-xs">
                    {formatDate(hour, 'h a')}
                  </span>
                )}
              </div>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div
              key={day.toString()}
              className="relative grid auto-cols-fr border-accent border-r last:border-r-0 data-outside-cell:bg-accent/50 data-outside-cell:text-muted-foreground"
              data-today={isToday(day) || undefined}
              data-outside-cell={(getDay(day) === 0 && dayIndex === 6) || undefined}
            >
              {(processedDayEvents[dayIndex] ?? []).map((positionedEvent) => (
                <UnstyledButton
                  key={positionedEvent.event._id}
                  className="absolute z-10 px-0.5 text-left"
                  style={{
                    top: `${positionedEvent.top}px`,
                    height: `${positionedEvent.height}px`,
                    left: `${positionedEvent.left * 100}%`,
                    width: `${positionedEvent.width * 100}%`,
                    zIndex: positionedEvent.zIndex,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="size-full">
                    <DraggableEvent
                      event={positionedEvent.event}
                      view="week"
                      onClick={(e) => handleEventClick(positionedEvent.event, e)}
                      showTime
                      height={positionedEvent.height}
                    />
                  </div>
                </UnstyledButton>
              ))}
              {currentTimeVisible && isToday(day) && (
                <div className="pointer-events-none absolute right-0 left-0 z-20" style={{ top: `${currentTimePosition}%` }}>
                  <div className="relative flex items-center">
                    <div className="absolute -left-1 size-2 rounded-full bg-primary"></div>
                    <div className="h-[2px] w-full bg-primary"></div>
                  </div>
                </div>
              )}
              {hours.map((hour) => {
                const hourValue = getHours(hour);
                return (
                  <div key={hour.toString()} className="relative min-h-[var(--week-cells-height)] border-accent border-b last:border-b-0">
                    {[0, 1, 2, 3].map((quarter) => {
                      const quarterHourTime = hourValue + quarter * 0.25;
                      return (
                        <DroppableCell
                          key={`${hour.toString()}-${quarter}`}
                          id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                          date={day}
                          time={quarterHourTime}
                          className={cn(
                            'absolute h-[calc(var(--week-cells-height)/4)] w-full',
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
