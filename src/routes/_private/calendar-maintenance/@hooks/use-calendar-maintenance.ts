import { useQuery } from '@tanstack/react-query';
import { addMonths, addWeeks, endOfWeek, format, isSameMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from '@/lib/api/client';
import type { CalendarFilterParams, CalendarView, PartialSchedule } from '../@interface/schedule';
import { transformLegacyEvent } from '../@utils/calendar.utils';

export function useEventScheduleCalendar(params: CalendarFilterParams) {
  return useQuery({
    queryKey: ['event-schedule', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('idEnterprise', params.idEnterprise);
      if (params.month) queryParams.append('month', params.month);
      if (params.year) queryParams.append('year', params.year);
      if (params.day) queryParams.append('day', params.day);
      if (params.eventType) {
        const type = typeof params.eventType === 'object' ? (params.eventType as any).value : params.eventType;
        queryParams.append('eventType', type);
      }

      if (params.idMachine?.length) {
        params.idMachine.forEach((id) => {
          queryParams.append('idMachine[]', id);
        });
      }
      if (params.idMaintenancePlan?.length) {
        params.idMaintenancePlan.forEach((id) => {
          queryParams.append('idMaintenancePlan[]', id);
        });
      }
      if (params.managers?.length) {
        params.managers.forEach((id) => {
          queryParams.append('managers[]', id);
        });
      }
      if (params.status) queryParams.append('status', params.status);

      const response = await api.get<any[]>('/event-schedule', {
        params: queryParams,
      });

      return (response.data || []).map(transformLegacyEvent);
    },
    enabled: !!params.idEnterprise,
  });
}

export function useCalendarMaintenance() {
  const isMobile = useIsMobile();
  const { idEnterprise } = useEnterpriseFilter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [filters, setFilters] = useState<Partial<Omit<CalendarFilterParams, 'idEnterprise'>>>({});

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
    toast('Criar evento em: ' + format(start, 'dd/MM/yyyy HH:mm'));
  };

  const handleEventSelect = (event: PartialSchedule) => {
    toast('Selecionou evento: ' + event.title);
  };

  const headerTitle = useMemo(() => {
    if (isMobile) return format(currentDate, 'MMMM', { locale: ptBR });
    switch (view) {
      case 'week': {
        const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
        const endWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
        if (isSameMonth(startWeek, endWeek)) {
          return format(startWeek, 'MMMM yyyy', { locale: ptBR });
        }
        return `${format(startWeek, 'MMM', { locale: ptBR })} - ${format(endWeek, 'MMM yyyy', { locale: ptBR })}`;
      }
      default:
        return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
  }, [currentDate, view, isMobile]);

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
    handleEventSelect,
    headerTitle,
    filters,
    setFilters,
  };
}
