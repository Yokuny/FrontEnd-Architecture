import { addHours, areIntervalsOverlapping, differenceInMinutes, eachHourOfInterval, getHours, getMinutes, isSameDay, startOfDay } from 'date-fns';
import type React from 'react';
import { useMemo } from 'react';
import { useCurrentTimeIndicator } from '@/hooks/use-current-time-indicator';
import { EndHour, StartHour, WeekCellsHeight } from '@/lib/config/calendar.config';
import { isMultiDayEvent } from '@/lib/helpers/calendar.helper';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { cn } from '@/lib/utils/cn.util';
import type { DayViewProps, PositionedEvent } from '../@interface/schedule.interface';

import { DraggableEvent } from './draggable-event';
import { EventItem } from './event-item';
import { DroppableCell } from './square';

export function DayView({ currentDate, events, onEventSelect, onEventCreate }: DayViewProps) {
  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const dayEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        return isSameDay(currentDate, eventStart) || isSameDay(currentDate, eventEnd) || (currentDate > eventStart && currentDate < eventEnd);
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [currentDate, events]);

  const allDayEvents = useMemo(() => {
    return dayEvents.filter((event) => event.allDay || isMultiDayEvent(event));
  }, [dayEvents]);

  const timeEvents = useMemo(() => {
    return dayEvents.filter((event) => !event.allDay && !isMultiDayEvent(event));
  }, [dayEvents]);

  const positionedEvents = useMemo(() => {
    const result: PositionedEvent[] = [];
    const dayStart = startOfDay(currentDate);
    const sortedEvents = [...timeEvents].sort((a, b) => {
      const aStart = new Date(a.start);
      const bStart = new Date(b.start);
      if (aStart < bStart) return -1;
      if (aStart > bStart) return 1;
      return differenceInMinutes(new Date(b.end || b.start), bStart) - differenceInMinutes(new Date(a.end || a.start), aStart);
    });

    const columns: { event: PartialSchedule; end: Date }[][] = [];
    sortedEvents.forEach((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end || event.start);
      const adjustedStart = isSameDay(currentDate, eventStart) ? eventStart : dayStart;
      const adjustedEnd = isSameDay(currentDate, eventEnd) ? eventEnd : addHours(dayStart, 24);
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
      result.push({ event, top, height, left: columnIndex === 0 ? 0 : columnIndex * 0.1, width: columnIndex === 0 ? 1 : 0.9, zIndex: 10 + columnIndex });
    });
    return result;
  }, [currentDate, timeEvents]);

  const handleEventClick = (event: PartialSchedule, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const showAllDaySection = allDayEvents.length > 0;
  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(currentDate, 'day');

  return (
    <div data-slot="day-view" className="flex h-full flex-col rounded-md border">
      {showAllDaySection && (
        <div className="rounded-t-sm border-accent bg-accent/50">
          <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr]">
            <div className="relative flex items-center justify-center">
              <div className="text-center text-muted-foreground text-xs">{t('all.day')}</div>
            </div>
            <div className="relative border-accent border-r p-1 last:border-r-0">
              {allDayEvents.map((event) => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end || event.start);
                const isFirstDay = isSameDay(currentDate, eventStart);
                const isLastDay = isSameDay(currentDate, eventEnd);
                return (
                  <EventItem
                    key={`spanning-${event._id}`}
                    onClick={(e) => handleEventClick(event, e)}
                    className="md:text-md"
                    event={event}
                    view="month"
                    isFirstDay={isFirstDay}
                    isLastDay={isLastDay}
                  >
                    {event.title}
                  </EventItem>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-[3rem_1fr] sm:grid-cols-[4rem_1fr]">
        <div>
          {hours.map((hour, index) => (
            <div key={hour.toString()} className="relative h-[var(--week-cells-height)] border-accent border-b last:border-b-0">
              {index > 0 && (
                <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground sm:pe-4 sm:text-xs">
                  {formatDate(hour, 'h a')}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="relative">
          {positionedEvents.map((positionedEvent) => (
            <div
              key={positionedEvent.event._id}
              className="absolute z-10 px-0.5"
              style={{
                top: `${positionedEvent.top}px`,
                height: `${positionedEvent.height}px`,
                left: `${positionedEvent.left * 100}%`,
                width: `${positionedEvent.width * 100}%`,
                zIndex: positionedEvent.zIndex,
              }}
            >
              <div className="size-full">
                <DraggableEvent event={positionedEvent.event} view="day" onClick={(e) => handleEventClick(positionedEvent.event, e)} showTime height={positionedEvent.height} />
              </div>
            </div>
          ))}
          {currentTimeVisible && (
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
              <div key={hour.toString()} className="relative h-[var(--week-cells-height)] border-accent border-b last:border-b-0">
                {[0, 1, 2, 3].map((quarter) => {
                  const quarterHourTime = hourValue + quarter * 0.25;
                  return (
                    <DroppableCell
                      key={`${hour.toString()}-${quarter}`}
                      id={`day-cell-${currentDate.toISOString()}-${quarterHourTime}`}
                      date={currentDate}
                      time={quarterHourTime}
                      className={cn(
                        'absolute h-[calc(var(--week-cells-height)/4)] w-full',
                        quarter === 0 && 'top-0',
                        quarter === 1 && 'top-[calc(var(--week-cells-height)/4)]',
                        quarter === 2 && 'top-[calc(var(--week-cells-height)/4*2)]',
                        quarter === 3 && 'top-[calc(var(--week-cells-height)/4*3)]',
                      )}
                      onClick={() => {
                        const start = new Date(currentDate);
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
      </div>
    </div>
  );
}
