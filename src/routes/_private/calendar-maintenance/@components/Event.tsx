'use client';

import { differenceInMinutes, format, getMinutes, isPast } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    <button
      data-past-event={isEventInPast || undefined}
      className={cn(
        'select-none overflow-hidden border-none px-1 backdrop-blur-md transition data-past-event:line-through',
        getEventColorClasses(event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function EventItem({ event, view, onClick, showTime, currentTime, isFirstDay = true, isLastDay = true, children, className }: EventItemProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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
    if (event.allDay) return t('all.day');
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
            <ItemTitle className="truncate tracking-tighter">{event.title}</ItemTitle>
          </ItemContent>
        )}
      </EventWrapper>
    );
  }

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
          <ItemTitle className="font-normal leading-none">{event.title}</ItemTitle>
          {showTime && <ItemContent className="flex-none font-normal">{formatTimeWithOptionalMinutes(displayStart)}</ItemContent>}
        </ItemContent>
      ) : (
        <ItemContent className="gap-0.5">
          <ItemTitle className="font-normal leading-none">{event.title}</ItemTitle>
          {showTime && !isMobile && <ItemContent className="font-normal text-[10px] opacity-80">{getEventTime()}</ItemContent>}
        </ItemContent>
      )}
    </EventWrapper>
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
