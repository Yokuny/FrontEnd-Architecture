import { createFileRoute, useNavigate } from '@tanstack/react-router';
import Back from '@/components/icons/Back.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data, isLoading, getPatientName, getRoomName, getProfessionalName } = useScheduleDetails(id);

  const nextEvent = data?.nextEvent ?? null;
  const futureEvents = data?.futureEvents ?? [];
  const pastEvents = data?.pastEvents ?? [];

  return (
    <Card asPage className="flex w-full flex-col">
      <CardHeader>
        <CardAction>
          <Button type="button" size={isMobile ? 'default' : 'sm'} variant="outline" onClick={() => navigate({ to: '..' })}>
            <Back className="size-4" />
            <span className="sr-only md:not-sr-only">{t('back')}</span>
          </Button>
        </CardAction>
      </CardHeader>

      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <ItemTitle className="text-sky-blue text-xl dark:text-primary-blue">
          {t('patient')}: {getPatientName(id)}
        </ItemTitle>
      </div>

      {isLoading || !id ? (
        <ScheduleListSkeleton />
      ) : (
        <ScheduleList nextEvent={nextEvent} futureEvents={futureEvents} pastEvents={pastEvents} getRoomName={getRoomName} getProfessionalName={getProfessionalName} />
      )}
    </Card>
  );
}
