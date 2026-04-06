import Calender from '@/components/icons/Calender.Icon';
import { CardContent, CardTitle } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import { t } from '@/lib/helpers/translate.helper';
import type { DbSchedule } from '@/lib/interfaces/schedule.interface';
import { ScheduleCard } from './schedule-card';

interface ScheduleListProps {
  nextEvent: DbSchedule | null;
  futureEvents: DbSchedule[];
  pastEvents: DbSchedule[];
  getRoomName: (roomId: string | undefined) => string | undefined;
  getProfessionalName: (profId: string | undefined) => string | undefined;
}

export function ScheduleList({ nextEvent, futureEvents, pastEvents, getRoomName, getProfessionalName }: ScheduleListProps) {
  const hasAnySchedules = nextEvent || futureEvents.length > 0 || pastEvents.length > 0;

  if (!hasAnySchedules) {
    return (
      <CardContent className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calender className="mb-4 size-12 text-muted-foreground" />
          <ItemTitle className="mb-2 text-muted-foreground">{t('no.schedules.found')}</ItemTitle>
          <p className="text-muted-foreground text-sm">{t('no.schedules.description')}</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {nextEvent && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('next.appointment')}</CardTitle>
          <ScheduleCard schedule={nextEvent} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
        </CardContent>
      )}

      {futureEvents.length > 0 && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('future.appointments')}</CardTitle>
          <div className="space-y-3">
            {futureEvents.map((event) => (
              <ScheduleCard key={event._id} schedule={event} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
            ))}
          </div>
        </CardContent>
      )}

      {pastEvents.length > 0 && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{t('past.appointments')}</CardTitle>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <ScheduleCard key={event._id} schedule={event} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
            ))}
          </div>
        </CardContent>
      )}
    </div>
  );
}
