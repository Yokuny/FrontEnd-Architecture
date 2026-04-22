import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils/cn.util';
import type { DroppableCellProps } from '../@interface/schedule.interface';
import { useCalendarDnd } from './calendar-dnd-provider';

export function DroppableCell({ id, date, time, children, className, onClick }: DroppableCellProps) {
  const { activeEvent } = useCalendarDnd();

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { date, time },
  });

  const formattedTime =
    time !== undefined
      ? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60)
          .toString()
          .padStart(2, '0')}`
      : null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: cell acts as a button; nested interactive children forbid using a native <button>
    <div
      ref={setNodeRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn('flex h-full cursor-pointer flex-col overflow-hidden px-0.5 py-1 text-left data-dragging:bg-accent', className)}
      title={formattedTime ? `${formattedTime}` : undefined}
      data-dragging={isOver && activeEvent ? true : undefined}
    >
      {children}
    </div>
  );
}
