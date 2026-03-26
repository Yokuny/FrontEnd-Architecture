import { useDroppable } from '@dnd-kit/core';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { cn } from '@/lib/utils/cn.util';
import { useCalendarDnd } from './calendar-dnd-context';

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

  return (
    <UnstyledButton
      ref={setNodeRef}
      onClick={onClick}
      className={cn('flex h-full flex-col overflow-hidden px-0.5 py-1 data-dragging:bg-accent', className)}
      title={formattedTime ? `${formattedTime}` : undefined}
      data-dragging={isOver && activeEvent ? true : undefined}
    >
      {children}
    </UnstyledButton>
  );
}

type DroppableCellProps = {
  id: string;
  date: Date;
  time?: number;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};
