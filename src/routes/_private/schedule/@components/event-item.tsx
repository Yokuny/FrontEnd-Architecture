import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { differenceInMinutes, format, getMinutes, isPast } from 'date-fns';
import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getBorderRadiusClasses, getEventColorClasses } from '@/lib/helpers/calendar.utils';
import type { PartialSchedule } from '@/lib/interfaces/schedule';
import { cn } from '@/lib/utils/cn.util';

const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? 'ha' : 'h:mma').toLowerCase();
};

function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  isDragging,
  onClick,
  className,
  children,
  currentTime,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventWrapperProps) {
  const displayEnd = currentTime
    ? new Date(new Date(currentTime).getTime() + (new Date(event.end || event.start).getTime() - new Date(event.start).getTime()))
    : new Date(event.end || event.start);

  const isEventInPast = isPast(displayEnd);

  return (
    <button
      className={cn(
        'flex size-full select-none overflow-hidden px-1 text-left font-medium outline-none backdrop-blur-md transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-dragging:cursor-grabbing data-past-event:line-through data-dragging:shadow-lg sm:px-2',
        getEventColorClasses(event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className,
      )}
      data-dragging={isDragging || undefined}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      {children}
    </button>
  );
}

export function EventItem({
  event,
  view,
  isDragging,
  onClick,
  showTime,
  currentTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
  dndListeners,
  dndAttributes,
  onMouseDown,
  onTouchStart,
}: EventItemProps) {
  const isMobile = useIsMobile();

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
        isDragging={isDragging}
        onClick={onClick}
        className={cn('mt-[var(--event-gap)] h-[var(--event-height)] items-center text-xs', className)}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children || (
          <div className="flex items-baseline gap-1">
            {!event.allDay && <span className="text-xs opacity-70">{formatTimeWithOptionalMinutes(displayStart)}</span>}
            <span className="truncate font-semibold text-xs tracking-normal md:text-md">{event.title}</span>
          </div>
        )}
      </EventWrapper>
    );
  }

  if (view === 'week' || view === 'day') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        isDragging={isDragging}
        onClick={onClick}
        className={cn('py-0.5', durationMinutes < 45 ? 'items-center' : 'flex-col', view === 'week' ? 'text-[10px] sm:text-xs' : 'text-xs', className)}
        currentTime={currentTime}
        dndListeners={dndListeners}
        dndAttributes={dndAttributes}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {durationMinutes < 45 ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold leading-none">{event.title}</span>
            {showTime && <span className="text-xs opacity-70">{formatTimeWithOptionalMinutes(displayStart)}</span>}
          </div>
        ) : (
          <>
            <span className="font-semibold leading-none">{event.title}</span>
            {showTime && !isMobile && <span className="text-xs opacity-70">{getEventTime()}</span>}
          </>
        )}
      </EventWrapper>
    );
  }

  // Agenda view
  return (
    <button
      className={cn(
        'flex w-full flex-col gap-1 rounded p-2 text-left outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(event.color),
        className,
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      {...dndListeners}
      {...dndAttributes}
    >
      <span className="font-semibold text-md">{event.title}</span>
      {event.allDay ? (
        <span className="text-xs opacity-70">Dia inteiro</span>
      ) : (
        <span className="text-xs opacity-70">
          {formatTimeWithOptionalMinutes(displayStart)} - {formatTimeWithOptionalMinutes(displayEnd)}
        </span>
      )}
    </button>
  );
}

type EventWrapperProps = {
  event: PartialSchedule;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
};

export type EventItemProps = {
  event: PartialSchedule;
  view: 'month' | 'week' | 'day' | 'agenda';
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  currentTime?: Date;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
  dndListeners?: SyntheticListenerMap;
  dndAttributes?: DraggableAttributes;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
};
