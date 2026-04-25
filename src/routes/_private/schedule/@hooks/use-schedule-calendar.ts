import { addDays, addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgendaDaysToShow } from '@/lib/config/calendar.config';
import type { CalendarView } from '@/lib/interfaces/schedule.interface';
import type { CustomDateRange } from '../@interface/schedule.interface';
import { getDateRangeForView } from '../@utils/schedule.utils';

const useScheduleCalendarStore = create<ScheduleCalendarStore>()(
  persist(
    (set) => ({
      view: 'week',
      setView: (view) => set({ view }),
    }),
    {
      name: 'calendar-view',
      partialize: (state) => ({ view: state.view }),
    },
  ),
);

export function useScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | null>(null);
  const { view, setView } = useScheduleCalendarStore();

  const { startDate, endDate } = useMemo(() => getDateRangeForView(currentDate, view, customDateRange), [currentDate, view, customDateRange]);

  useEffect(() => {
    if (view !== 'agenda') setCustomDateRange(null);
  }, [view]);

  const handlePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(addDays(currentDate, -1));
    else if (view === 'agenda') setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else if (view === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (view === 'agenda') setCurrentDate(addDays(currentDate, AgendaDaysToShow));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleRangeSelect = (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
    if (range?.from && range?.to) {
      setCustomDateRange({ from: range.from, to: range.to });
      setView('agenda');
      setCurrentDate(range.from);
    } else if (range?.from) {
      setCurrentDate(range.from);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      if (view === 'month') setView('week');
    }
  };

  return {
    view,
    setView,
    currentDate,
    setCurrentDate,
    customDateRange,
    setCustomDateRange,
    startDate,
    endDate,
    handlePrevious,
    handleNext,
    handleTodayClick,
    handleDateSelect,
    handleRangeSelect,
  };
}

export type ScheduleCalendar = ReturnType<typeof useScheduleCalendar>;

type ScheduleCalendarStore = {
  view: CalendarView;
  setView: (view: CalendarView) => void;
};
