import type { DraggableAttributes, UniqueIdentifier } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type React from 'react';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';

export type CustomDateRange = { from: Date; to: Date };

export interface ScheduleApiParams {
  startDate: Date;
  endDate: Date;
  selectedRoomID: string;
}

// time-update-dialog.tsx
export type TimeUpdateProps = {
  isOpen: boolean;
  onClose: () => void;
  pendingEvent: PartialSchedule | null;
  onConfirm: (updatedEvent: PartialSchedule) => void;
};

// calendar-dnd-context.tsx
export type CalendarDndContextType = {
  activeEvent: PartialSchedule | null;
  activeId: UniqueIdentifier | null;
  activeView: 'month' | 'week' | 'day' | null;
  currentTime: Date | null;
  eventHeight: number | null;
  isMultiDay: boolean;
  multiDayWidth: number | null;
  dragHandlePosition: {
    x?: number;
    y?: number;
    data?: {
      isFirstDay?: boolean;
      isLastDay?: boolean;
    };
  } | null;
};

export type CalendarDndProviderProps = {
  children: React.ReactNode;
  onEventUpdate: (event: PartialSchedule) => void;
};

// event-item.tsx
export type EventWrapperProps = {
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

// draggable-event.tsx
export type DraggableEventProps = {
  event: PartialSchedule;
  view: 'month' | 'week' | 'day';
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
};

// square.tsx (DroppableCell)
export type DroppableCellProps = {
  id: string;
  date: Date;
  time?: number;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

// month-view.tsx
export type MonthViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
  onEventCreate: (start: Date) => void;
};

// week-view.tsx
export type WeekViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
  onEventCreate: (start: Date) => void;
};

export type PositionedEvent = {
  event: PartialSchedule;
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
};

// day-view.tsx
export type DayViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
  onEventCreate: (start: Date) => void;
};

// agenda-view.tsx
export type AgendaViewProps = {
  currentDate: Date;
  events: PartialSchedule[];
  onEventSelect: (event: PartialSchedule) => void;
};
