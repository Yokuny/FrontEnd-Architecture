'use client';

import { differenceInMinutes, format, getMinutes, isPast } from 'date-fns';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemTitle } from '@/components/ui/item';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import type { PartialSchedule } from '../@interface/schedule';
import { getBorderRadiusClasses, getEventColorClasses } from '../@utils/calendar.utils';

const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? 'ha' : 'h:mma').toLowerCase();
};

// Shared wrapper component for event styling
function EventWrapper({ event, isFirstDay = true, isLastDay = true, onClick, className, children, currentTime }: EventWrapperProps) {
  // Always use the currentTime (if provided) to determine if the event is in the past
  const displayEnd = currentTime
    ? new Date(new Date(currentTime).getTime() + (new Date(event.end || event.start).getTime() - new Date(event.start).getTime()))
    : new Date(event.end || event.start);

  const isEventInPast = isPast(displayEnd);

  return (
    <Button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] data-past-event:line-through sm:px-2',
        getEventColorClasses(event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function EventItem({ event, view, onClick, showTime, currentTime, isFirstDay = true, isLastDay = true, children, className }: EventItemProps) {
  const isMobile = useIsMobile();
  const eventColor = event.color;
  // Use the provided currentTime (for dragging) or the event's actual time
  const displayStart = useMemo(() => {
    return currentTime || new Date(event.start);
  }, [currentTime, event.start]);

  const displayEnd = useMemo(() => {
    return currentTime ? new Date(new Date(currentTime).getTime() + (new Date(event.end).getTime() - new Date(event.start).getTime())) : new Date(event.end);
  }, [currentTime, event.start, event.end]);

  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = () => {
    if (event.allDay) return 'Dia inteiro';
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`;
  };

  if (view === 'month') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn('mt-(--event-gap) h-(--event-height) items-center text-xs', className)}
        currentTime={currentTime}
      >
        {children || (
          <ItemContent className="flex-row items-baseline gap-1">
            {!event.allDay && <ItemContent className="flex-none">{formatTimeWithOptionalMinutes(displayStart)}</ItemContent>}
            <ItemTitle className="md:text-md truncate tracking-normal font-normal">{event.title}</ItemTitle>
          </ItemContent>
        )}
      </EventWrapper>
    );
  }

  if (view === 'week') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn('py-0.5', durationMinutes < 45 ? 'items-center' : 'flex-col', 'text-[10px] sm:text-xs', className)}
        currentTime={currentTime}
      >
        {durationMinutes < 45 ? (
          <ItemContent className="flex-row items-center gap-2">
            <ItemTitle className="leading-none font-normal">{event.title}</ItemTitle>
            {showTime && <ItemContent className="flex-none font-normal">{formatTimeWithOptionalMinutes(displayStart)}</ItemContent>}
          </ItemContent>
        ) : (
          <ItemContent className="gap-0.5">
            <ItemTitle className="leading-none font-normal">{event.title}</ItemTitle>
            {showTime && !isMobile && <ItemContent className="text-[10px] opacity-80 font-normal">{getEventTime()}</ItemContent>}
          </ItemContent>
        )}
      </EventWrapper>
    );
  }

  return (
    <Button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(eventColor),
        className,
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
    >
      <ItemContent className="gap-1 p-0">
        <ItemTitle className="text-md font-semibold">{event.title}</ItemTitle>
        {event.allDay ? (
          <ItemContent className="text-xs font-normal">Dia inteiro</ItemContent>
        ) : (
          <ItemContent className="text-xs font-normal">
            {formatTimeWithOptionalMinutes(displayStart)} - {formatTimeWithOptionalMinutes(displayEnd)}
          </ItemContent>
        )}
      </ItemContent>
    </Button>
  );
}

type EventWrapperProps = {
  event: PartialSchedule;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
};

type EventItemProps = {
  event: PartialSchedule;
  view: 'month' | 'week';
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
};
