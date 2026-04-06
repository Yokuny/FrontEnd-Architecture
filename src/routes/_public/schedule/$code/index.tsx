import { createFileRoute, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleConfirmationForm } from './@components/schedule-confirmation-form';
import { usePublicSchedulePasskey } from './@hooks/use-schedule';

export const Route = createFileRoute('/_public/schedule/$code/')({
  component: ScheduleConfirmationPage,
});

function ScheduleConfirmationPage() {
  const { code } = useParams({ from: '/_public/schedule/$code/' });
  const { data: scheduleData, isLoading, error } = usePublicSchedulePasskey(code);

  if (error) {
    toast.error(error.message || 'Erro ao carregar dados do agendamento');
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4 py-4 text-center text-muted-foreground">
            <p>Não foi possível carregar as informações do seu agendamento.</p>
          </div>
        </div>
      </div>
    );
  }

  if (scheduleData) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <ScheduleConfirmationForm scheduleData={scheduleData.content} scheduleID={scheduleData.id} />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-5 w-96" />
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
                <Skeleton className="h-12 w-1/4 md:w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
