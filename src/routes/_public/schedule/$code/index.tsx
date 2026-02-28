import { createFileRoute, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleConfirmationForm } from './@components/schedule-confirmation-form';
import { usePublicScheduleApi } from './@hooks/use-schedule';

export const Route = createFileRoute('/_public/schedule/$code/')({
  component: ScheduleConfirmationPage,
});

function ScheduleConfirmationPage() {
  const { code } = useParams({ from: '/_public/schedule/$code/' });
  const { getPasskey } = usePublicScheduleApi();
  const { data: scheduleData, isLoading, error } = getPasskey(code);

  if (error) {
    toast.error(error.message || 'Erro ao carregar dados do agendamento');
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Não foi possível carregar as informações do seu agendamento.</p>
      </div>
    );
  }

  if (scheduleData) {
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-between lg:p-8">
        <div className="flex h-full w-full max-w-2xl justify-center">
          <ScheduleConfirmationForm scheduleData={scheduleData.content} scheduleID={scheduleData.id} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-between lg:p-8">
        <div className="flex h-full w-full max-w-2xl justify-center">
          <div className="bg-background flex w-full flex-wrap gap-6 p-8">
            <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-5 w-96" />
              </div>
            </div>

            <Skeleton className="flex h-28 w-full p-0 md:p-6 md:py-4" />
            <Skeleton className="flex h-28 w-full p-0 md:p-6 md:py-4" />

            <div className="space-y-2 border-none p-6">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-56" />
              </div>
            </div>
            <div className="w-full">
              <div className="flex gap-3">
                <Skeleton className="h-12 w-full md:w-1/2" />
                <Skeleton className="h-12 w-1/3 md:w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
