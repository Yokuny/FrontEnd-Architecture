import { createFileRoute, useParams } from '@tanstack/react-router';

import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { ItemDescription } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

import DentalEaseLogo from '../../auth/@components/dental-ease-logo';
import { ScheduleConfirmationForm } from './@components/confirmation-form';
import { usePublicSchedulePasskey } from './@hooks/use-schedule';

export const Route = createFileRoute('/_public/schedule/$code/')({
  component: ScheduleConfirmationPage,
});

function ScheduleConfirmationPage() {
  const { code } = useParams({ from: '/_public/schedule/$code/' });
  const { data: scheduleData, isLoading, error } = usePublicSchedulePasskey(code);

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center gap-10">
      <div className="flex w-full items-center justify-between gap-4">
        <DentalEaseLogo />
        <ThemeSwitcher />
      </div>
      <div className="flex w-full flex-1 flex-col justify-center">
        {isLoading ? (
          <ScheduleSkeleton />
        ) : error ? (
          <div className="w-full space-y-4 py-12 text-center">
            <ItemDescription className="line-clamp-none font-sans text-lg tracking-tight md:text-xl">Não foi possível carregar as informações do seu agendamento.</ItemDescription>
          </div>
        ) : scheduleData ? (
          <ScheduleConfirmationForm scheduleData={scheduleData.content} scheduleID={scheduleData.id} />
        ) : null}
      </div>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="w-full space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>

      <div className="space-y-6">
        {['day', 'time', 'patient', 'professional', 'procedures'].map((row) => (
          <div key={row} className="grid grid-cols-3 gap-4 border-border border-b pb-6">
            <div className="col-span-2 flex items-center gap-4 md:col-span-1">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="hidden md:block" />
            <div className="col-span-3 flex flex-col items-end gap-2 md:col-span-1">
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-12 w-full md:w-1/2" />
        <Skeleton className="h-12 w-1/3 md:w-1/2" />
      </div>
    </div>
  );
}
