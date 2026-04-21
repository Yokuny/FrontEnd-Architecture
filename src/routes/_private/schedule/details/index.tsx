import { createFileRoute } from '@tanstack/react-router';
import { Card, CardHeader } from '@/components/ui/card';
import { t } from '@/lib/helpers/translate.helper';
import { ScheduleList } from './@components/schedule-list';
import { ScheduleListSkeleton } from './@components/schedule-skeleton';
import { useScheduleDetails } from './@hooks/use-schedule-details';
import { searchSchema } from './@interface/details.schema';

export const Route = createFileRoute('/_private/schedule/details/')({
  component: PatientSchedulePage,
  validateSearch: searchSchema,
  staticData: {
    title: t('schedule.history'),
    description: t('schedule.history.description'),
  },
});

function PatientSchedulePage() {
  const { id } = Route.useSearch();
  const { data, isLoading, getPatientName, getRoomName, getProfessionalName } = useScheduleDetails(id);

  const nextEvent = data?.nextEvent ?? null;
  const futureEvents = data?.futureEvents ?? [];
  const pastEvents = data?.pastEvents ?? [];

  return (
    <Card asPage className="flex w-full flex-col">
      <CardHeader title={getPatientName(id)} />

      {isLoading || !id ? (
        <ScheduleListSkeleton />
      ) : (
        <ScheduleList nextEvent={nextEvent} futureEvents={futureEvents} pastEvents={pastEvents} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
      )}
    </Card>
  );
}
