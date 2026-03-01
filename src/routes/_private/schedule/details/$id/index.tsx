import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Calendar, ChevronRight, Clock, DollarSign, FileText, MapPin, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useClinicStore } from '@/hooks/clinic';
import { usePatientStore } from '@/hooks/patients';
import { useProfessionalStore } from '@/hooks/professionals';
import { useIsMobile } from '@/hooks/use-mobile';
import { extractDate, getStatusColor, statusDictionary, stringToDate } from '@/lib/helpers/formatter.helper';
import type { DbSchedule } from '@/lib/interfaces/schedule';
import { cn } from '@/lib/utils';
import { useClinicApi } from '@/query/clinic';
import { usePatientsQuery } from '@/query/patients';
import { useProfessionalsQuery } from '@/query/professionals';
import { usePatientSchedulesQuery } from '@/query/schedule';

export const Route = createFileRoute('/_private/schedule/details/$id/')({
  component: PatientSchedulePage,
});

function PatientSchedulePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { data: patients } = usePatientsQuery();
  const getPatientName = (patientId: string | undefined) => usePatientStore.getState().getName(patients, patientId);
  const { data, isLoading } = usePatientSchedulesQuery(id);

  const nextEvent = data?.nextEvent ?? null;
  const futureEvents = data?.futureEvents ?? [];
  const pastEvents = data?.pastEvents ?? [];

  return (
    <Card className="flex w-full flex-col-reverse pb-14 md:flex-col md:pb-0">
      <CardHeader className="fixed right-1 bottom-16 left-1 z-40 flex flex-row items-center justify-between py-4 md:static md:right-auto md:left-auto md:z-auto">
        <CardTitle className="text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">{getPatientName(id)}</CardTitle>
        <Button type="button" size={isMobile ? 'default' : 'sm'} variant="outline" onClick={() => navigate({ to: '..' })}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>
      </CardHeader>

      {isLoading || !id ? <ScheduleListSkeleton /> : <ScheduleList nextEvent={nextEvent} futureEvents={futureEvents} pastEvents={pastEvents} />}
    </Card>
  );
}

function ScheduleList({ nextEvent, futureEvents, pastEvents }: { nextEvent: DbSchedule | null; futureEvents: DbSchedule[]; pastEvents: DbSchedule[] }) {
  const hasAnySchedules = nextEvent || futureEvents.length > 0 || pastEvents.length > 0;

  if (!hasAnySchedules) {
    return (
      <CardContent className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="mb-4 size-12 text-muted-foreground" />
          <p className="mb-2 font-semibold text-muted-foreground">Nenhum agendamento encontrado</p>
          <p className="text-muted-foreground text-sm">Não existe agendamento cadastrado para este paciente.</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="space-y-2 md:space-y-4">
      {nextEvent && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">Próximo Agendamento</CardTitle>
          <ScheduleCard schedule={nextEvent} />
        </CardContent>
      )}

      {futureEvents.length > 0 && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">Próximos Agendamentos</CardTitle>
          <div className="space-y-3">
            {futureEvents.map((event) => (
              <ScheduleCard key={event._id} schedule={event} />
            ))}
          </div>
        </CardContent>
      )}

      {pastEvents.length > 0 && (
        <CardContent className="flex flex-col gap-3 p-4 md:p-6">
          <CardTitle className="px-2 text-lg text-sky-blue tracking-tight md:text-xl dark:text-primary-blue">Últimos Agendamentos</CardTitle>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <ScheduleCard key={event._id} schedule={event} />
            ))}
          </div>
        </CardContent>
      )}
    </div>
  );
}

function ScheduleCard({ schedule }: { schedule: DbSchedule }) {
  const { data: clinic } = useClinicApi();
  const { getRoomName: getRoomNameUtil } = useClinicStore();
  const getRoomName = (roomId: string | undefined) => getRoomNameUtil(clinic, roomId);
  const { data: professionals } = useProfessionalsQuery();
  const getProfessionalName = (profId: string | undefined) => useProfessionalStore.getState().getName(professionals, profId);
  const isMobile = useIsMobile();

  const renderScheduleDateTime = () => {
    const startDate = stringToDate(schedule.start);
    const endDate = stringToDate(schedule.end);
    const startDateStr = extractDate(schedule.start, '');
    const endDateStr = extractDate(schedule.end, '');
    const isSameDay = startDateStr === endDateStr;

    if (schedule.allDay) {
      return (
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <p className="font-bold text-xl tabular-nums md:text-2xl">{startDateStr}</p>
          </div>
          <ChevronRight className="size-4" />
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <p className="font-bold text-md tabular-nums md:text-base">{endDateStr}</p>
          </div>
          {!isMobile && (
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Clock className="size-4" />
              Dia inteiro
            </Button>
          )}
        </div>
      );
    }

    if (isSameDay) {
      return (
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <p className="font-bold text-xl tabular-nums md:text-2xl">{startDateStr}</p>
          </div>
          <ChevronRight className="size-4" />
          <div className="flex items-center gap-2">
            <Clock className="size-5" />
            <div className="flex items-center gap-1">
              <p className="font-bold text-md tabular-nums md:text-base">{extractDate(startDate, 'hour')}</p>
              <span className="text-muted-foreground">-</span>
              <p className="font-bold text-md tabular-nums md:text-base">{extractDate(endDate, 'hour')}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="size-5" />
          <p className="font-bold text-xl tabular-nums md:text-2xl">{extractDate(startDate, 'default')}</p>
        </div>
        <div className="flex items-center gap-2">
          <ChevronRight className="size-4" />
          <Calendar className="size-5" />
          <p className="font-bold text-md tabular-nums md:text-base">{extractDate(endDate, 'default')}</p>
        </div>
      </div>
    );
  };

  return (
    <CardContent className="p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>{new Date(schedule.start).toLocaleDateString('pt-BR', { weekday: 'long' })}</div>
          <Badge variant="outline" className="gap-1.5">
            <div className={cn('size-2 rounded-full', getStatusColor(schedule.status))} />
            {statusDictionary(schedule.status)}
          </Badge>
        </div>
        <div>{renderScheduleDateTime()}</div>

        <div className="flex flex-wrap items-start gap-2 pt-1 md:flex-col md:pt-2">
          <Button variant="ghost" size="sm" className="h-auto items-center gap-2 px-1 py-0.5">
            <MapPin className="size-4" />
            <span className="text-muted-foreground text-sm">{getRoomName(schedule.Room)}</span>
          </Button>

          {schedule.Professional && (
            <Button variant="ghost" size="sm" className="h-auto items-center gap-2 px-1 py-0.5">
              <Stethoscope className="size-4" />
              <span className="text-muted-foreground text-sm">{getProfessionalName(schedule.Professional)}</span>
            </Button>
          )}

          {schedule.Financial && (
            <Button variant="ghost" size="sm" className="h-auto items-center gap-2 px-1 py-0.5">
              <DollarSign className="size-4" />
              <span className="text-muted-foreground text-sm">Vinculado</span>
            </Button>
          )}

          {schedule.title && (
            <Button variant="ghost" size="sm" className="h-auto items-center gap-2 px-1 py-0.5">
              <FileText className="size-4" />
              <span className="text-muted-foreground text-sm">{schedule.title}</span>
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  );
}

function ScheduleListSkeleton() {
  return (
    <div className="space-y-2 md:space-y-4">
      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="rounded-lg border p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-56" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
