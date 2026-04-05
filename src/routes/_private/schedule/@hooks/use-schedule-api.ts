import { useEffect, useMemo, useState } from 'react';
import { useProfessionalColors } from '@/hooks/professionals';
import { getEventColorByProfessional } from '@/lib/helpers/formatter.helper';
import type { PartialSchedule } from '@/lib/interfaces/schedule.interface';
import { useScheduleQuery, useUpdateScheduleTime } from '@/query/schedule';
import type { ScheduleApiParams } from '../@interface/schedule.interface';
import { getDateRangeForView } from '../@utils/schedule.utils';

export function useScheduleApi({ currentDate, view, customDateRange, selectedRoomID }: ScheduleApiParams) {
  const { getColor: getProfessionalColor } = useProfessionalColors();
  const updateScheduleTime = useUpdateScheduleTime();

  const { startDate, endDate } = useMemo(() => getDateRangeForView(currentDate, view, customDateRange), [currentDate, view, customDateRange]);

  const { data: scheduleData } = useScheduleQuery({ startDate, endDate, roomID: selectedRoomID });

  const [events, setEvents] = useState<PartialSchedule[]>([]);

  useEffect(() => {
    if (scheduleData) {
      setEvents(
        scheduleData.map((event) => ({
          ...event,
          color: getEventColorByProfessional(event.Professional || '', getProfessionalColor, event.status),
        })),
      );
    }
  }, [scheduleData, getProfessionalColor]);

  return { events, setEvents, startDate, endDate, updateScheduleTime, getProfessionalColor };
}
