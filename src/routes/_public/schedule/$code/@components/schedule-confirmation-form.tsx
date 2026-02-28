import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { Check, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { extractDate } from '@/lib/helpers/formatter.helper';
import { scheduleConfirmationSchema } from '@/lib/interfaces/schemas/schedule.schema';
import { usePublicScheduleApi } from '../@hooks/use-schedule';

export const ScheduleConfirmationForm = ({ scheduleData, scheduleID }: ScheduleConfirmationFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { confirmPresence } = usePublicScheduleApi();

  const form = useForm<z.infer<typeof scheduleConfirmationSchema>>({
    resolver: zodResolver(scheduleConfirmationSchema),
  });

  const handleConfirm = async (status: 'confirmed' | 'canceled_by_patient') => {
    setIsLoading(true);
    try {
      await confirmPresence.mutateAsync({ scheduleID, status });

      const message = status === 'confirmed' ? 'Agendamento confirmado com sucesso!' : 'Agendamento cancelado com sucesso!';

      toast.success(message);
      router.navigate({ to: '/home' });
    } catch (e: any) {
      toast.error(e.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-6 bg-background p-8">
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-col gap-2">
          <CardTitle className="m-0 text-2xl text-sky-blue dark:text-primary-blue">Confirmação de Agendamento</CardTitle>
          <CardDescription className="flex text-md">Revise os detalhes do seu agendamento e confirme sua presença</CardDescription>
        </div>
      </div>

      <CardContent className="flex w-full justify-between p-0 md:p-6 md:py-4">
        <div className="flex flex-col justify-center space-y-2 p-6 md:px-2">
          <span className="text-muted-foreground text-sm uppercase">Dia</span>
          <span className="font-bold text-2xl">{extractDate(scheduleData.start, '')}</span>
        </div>
        <div className="flex flex-col justify-center space-y-2 p-6 md:px-2">
          <span className="text-muted-foreground text-sm uppercase">Horário</span>
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-2xl">{extractDate(scheduleData.start, 'hour')}</span>
            {scheduleData.end && <span className="font-bold text-2xl text-muted-foreground">{extractDate(scheduleData.end, 'hour')}</span>}
          </span>
        </div>
      </CardContent>

      <CardContent className="flex w-full justify-between p-0 md:p-6 md:py-4">
        <div className="flex flex-col justify-center space-y-2 p-6 md:px-2">
          <span className="text-muted-foreground text-sm uppercase">Paciente</span>
          <span className="font-bold text-2xl">{scheduleData.patientName}</span>
        </div>
        <div className="flex flex-col justify-center space-y-2 p-6 md:px-2">
          <span className="text-muted-foreground text-sm uppercase">Profissional</span>
          <span className="font-bold text-xl md:text-2xl">{scheduleData.professionalName}</span>
        </div>
      </CardContent>

      <CardContent className="space-y-2 border-none p-6">
        <span className="text-muted-foreground text-sm uppercase">Procedimentos</span>
        <ul>
          {scheduleData.procedures.map((procedure: string, index: number) => (
            <li key={index}>
              <span className="font-bold text-2xl">{procedure}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <div className="w-full">
        <Form {...form}>
          <div className="flex gap-3">
            <Button type="button" onClick={() => handleConfirm('confirmed')} disabled={isLoading} className="w-full md:w-1/2">
              {isLoading ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Check className="mr-2 hidden size-5 md:block" />}
              Confirmar presença
            </Button>
            <Button
              type="button"
              onClick={() => handleConfirm('canceled_by_patient')}
              disabled={isLoading}
              variant="outline"
              className="w-1/3 gap-2 font-semibold tracking-wide md:w-1/2"
            >
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <X className="size-6" />}
              <span className="hidden md:block">Não comparecerei</span>
            </Button>
          </div>
        </Form>
      </div>
      <div className="flex w-full items-center justify-center">
        <span className="max-w-lg text-center text-muted-foreground text-xs">
          Ao confirmar ou cancelar, você será redirecionado automaticamente. Em caso de dúvidas, entre em contato com a clínica.
        </span>
      </div>
    </div>
  );
};

type ScheduleConfirmationFormProps = {
  scheduleData: any;
  scheduleID: string;
};
