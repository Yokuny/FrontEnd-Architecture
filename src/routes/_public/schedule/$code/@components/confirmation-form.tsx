import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import Calender from '@/components/icons/Calender.Icon';
import Check from '@/components/icons/Check.Icon';
import Clock from '@/components/icons/Clock.Icon';
import Dental from '@/components/icons/Dental.Icon';
import Loader from '@/components/icons/Loader.Icon';
import Service from '@/components/icons/Service.Icon';
import User from '@/components/icons/User.Icon';
import { Button } from '@/components/ui/button';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/helpers/formatDate.helper';

import { type PublicSchedulePasskeyPayload, useConfirmPresence } from '../@hooks/use-schedule';

type ScheduleContent = PublicSchedulePasskeyPayload['content'];

type ScheduleConfirmationFormProps = {
  scheduleData: ScheduleContent;
  scheduleID: string;
};

type Row = {
  icon: React.ReactNode;
  label: string;
  values: React.ReactNode[];
};

export function ScheduleConfirmationForm({ scheduleData, scheduleID }: ScheduleConfirmationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confirmPresence = useConfirmPresence();

  const handleConfirm = async (status: 'confirmed' | 'canceled_by_patient') => {
    setIsLoading(true);
    try {
      const result = await confirmPresence.mutateAsync({ scheduleID, status });
      toast.success(result.message);
      router.navigate({ to: '/auth' });
    } catch {
      // erro tratado globalmente via MutationCache.onError
    } finally {
      setIsLoading(false);
    }
  };

  const timeRange = scheduleData.end ? `${formatDate(scheduleData.start, 'HH:mm')} – ${formatDate(scheduleData.end, 'HH:mm')}` : formatDate(scheduleData.start, 'HH:mm');

  const rows: Row[] = [
    {
      icon: <Calender className="size-5" aria-hidden />,
      label: 'Data',
      values: [formatDate(scheduleData.start)],
    },
    {
      icon: <Clock className="size-5" aria-hidden />,
      label: 'Horário',
      values: [timeRange],
    },
    {
      icon: <User className="size-5" aria-hidden />,
      label: 'Paciente',
      values: [scheduleData.patientName],
    },
    {
      icon: <Dental className="size-5" aria-hidden />,
      label: 'Profissional',
      values: [scheduleData.professionalName],
    },
    {
      icon: <Service className="size-5" aria-hidden />,
      label: 'Procedimentos',
      values: scheduleData.procedures.length > 0 ? scheduleData.procedures : ['—'],
    },
  ];

  return (
    <div className="w-full space-y-12">
      <div className="space-y-4">
        <ItemTitle className="font-sans font-semibold text-xl tracking-tight md:text-3xl">Confirmação de Agendamento</ItemTitle>
        <ItemDescription className="line-clamp-none font-sans text-lg tracking-tight md:text-xl">Revise os detalhes do seu agendamento e confirme sua presença.</ItemDescription>
      </div>

      <div className="space-y-6 p-4">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-3 gap-4 border-border border-b pb-6">
            <div className="col-span-2 flex items-center gap-4 md:col-span-1">
              {row.icon}
              <ItemTitle className="font-medium font-sans text-base">{row.label}</ItemTitle>
            </div>
            <div className="hidden md:block" />
            <div className="col-span-3 flex flex-col items-end gap-1 md:col-span-1">
              {row.values.map((value) => (
                <ItemDescription key={`${row.label}-${String(value)}`} className="line-clamp-none text-right font-sans text-sm">
                  {value}
                </ItemDescription>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button type="button" onClick={() => handleConfirm('confirmed')} disabled={isLoading} className="w-full">
            {isLoading ? <Loader className="size-5 animate-spin" /> : <Check className="hidden size-5 md:block" />}
            Confirmar presença
          </Button>
          <Button type="button" onClick={() => handleConfirm('canceled_by_patient')} disabled={isLoading} variant="outline" className="w-full gap-2 font-medium tracking-wide">
            {isLoading && <Loader className="size-5 animate-spin" />}
            <span>Não comparecerei</span>
          </Button>
        </div>

        <ItemDescription className="line-clamp-none text-center font-sans text-xs">
          Ao confirmar ou cancelar, você será redirecionado automaticamente. Em caso de dúvidas, entre em contato com a clínica.
        </ItemDescription>
      </div>
    </div>
  );
}
