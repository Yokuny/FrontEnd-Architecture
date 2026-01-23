import { useQuery } from '@tanstack/react-query';
import { addMonths, addWeeks, endOfWeek, format, isSameMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/lib/api/client';
import { getDateLocale } from '@/routes/_private/calendar-maintenance/@utils/locale';
import type { CalendarFilterParams, CalendarView, PartialSchedule } from '../@interface/schedule';
import { transformLegacyEvent } from '../@utils/calendar.utils';

export function useEventScheduleCalendar(params: CalendarFilterParams) {
  return useQuery({
    queryKey: ['event-schedule', params],
    queryFn: async () => {
      const queryParams: Record<string, any> = {
        idEnterprise: params.idEnterprise,
        month: params.month,
        year: params.year,
        day: params.day,
        status: params.status,
      };

      if (params.eventType) {
        queryParams.eventType = typeof params.eventType === 'object' ? (params.eventType as any).value : params.eventType;
      }

      if (params.idMachine?.length) {
        queryParams['idMachine[]'] = params.idMachine;
      }

      if (params.idMaintenancePlan?.length) {
        queryParams['idMaintenancePlan[]'] = params.idMaintenancePlan;
      }

      if (params.managers?.length) {
        queryParams['managers[]'] = params.managers;
      }

      const response = await api.get<any[]>('/event-schedule', {
        params: queryParams,
      });

      return (response.data || []).map(transformLegacyEvent);
    },
    enabled: !!params.idEnterprise,
  });
}

export function useCalendarMaintenance(idEnterprise: string) {
  const isMobile = useIsMobile();
  const { locale: appLocale } = useLocale();
  const dateLocale = getDateLocale(appLocale);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [filters, setFilters] = useState<Partial<Omit<CalendarFilterParams, 'idEnterprise'>>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<PartialSchedule> | null>(null);

  const { data: eventsRes = [], isLoading } = useEventScheduleCalendar({
    idEnterprise,
    month: format(currentDate, 'MM'),
    year: format(currentDate, 'yyyy'),
    ...filters,
  });

  const events = useMemo(() => {
    if (filters.status === 'next') {
      return eventsRes.filter(
        (m) =>
          (!m.dateDoneInit && m.datePlanEnd && new Date(m.datePlanEnd) > new Date()) ||
          (m.dateWindowEnd && new Date(m.dateWindowEnd) > new Date() && !m.datePlanEnd) ||
          (m.date && new Date(m.date) > new Date()),
      );
    }
    if (filters.status === 'late') {
      return eventsRes.filter(
        (m) =>
          (!m.dateDoneEnd && ((m.datePlanEnd && new Date(m.datePlanEnd) < new Date()) || (m.dateWindowEnd && new Date(m.dateWindowEnd) < new Date() && !m.datePlanEnd))) ||
          (m.date && new Date(m.date) < new Date()),
      );
    }
    return eventsRes;
  }, [eventsRes, filters.status]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleEventCreate = (start: Date) => {
    setSelectedEvent({
      id: '0',
      start,
      end: addWeeks(start, 0), // Default duration or same as start
      idEnterprise,
      eventType: 'maintenance',
    });
    setIsDialogOpen(true);
  };

  const handleAddEvent = () => {
    handleEventCreate(new Date());
  };

  const handleEventSelect = (event: PartialSchedule) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const headerTitle = useMemo(() => {
    if (isMobile) return format(currentDate, 'MMMM', { locale: dateLocale });
    switch (view) {
      case 'week': {
        const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
        const endWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
        if (isSameMonth(startWeek, endWeek)) {
          return format(startWeek, 'MMMM yyyy', { locale: dateLocale });
        }
        return `${format(startWeek, 'MMM', { locale: dateLocale })} - ${format(endWeek, 'MMM yyyy', { locale: dateLocale })}`;
      }
      default:
        return format(currentDate, 'MMMM yyyy', { locale: dateLocale });
    }
  }, [currentDate, view, isMobile, dateLocale]);

  return {
    currentDate,
    setCurrentDate,
    events,
    view,
    setView,
    isLoading,
    handlePrevious,
    handleNext,
    handleEventCreate,
    handleAddEvent,
    handleEventSelect,
    headerTitle,
    filters,
    setFilters,
    isDialogOpen,
    setIsDialogOpen,
    selectedEvent,
    setSelectedEvent,
  };
}
