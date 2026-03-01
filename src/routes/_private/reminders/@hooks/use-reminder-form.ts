import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { reminderSchema } from '@/lib/interfaces/schemas/reminder.schema';
import { useCreateReminder } from '@/query/reminders';
import type { ReminderFormData } from '../@interface/reminder.interface';

export function useReminderForm() {
  const createReminder = useCreateReminder();
  const navigate = useNavigate();

  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      Patient: '',
      description: '',
      scheduledDate: new Date().toISOString(),
    },
    mode: 'onChange',
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createReminder.mutateAsync(data);
      toast.success('Lembrete criado com sucesso!');
      navigate({ to: '/reminders', search: { showAll: true } });
    } catch (e: any) {
      toast.error(e.message || 'Erro ao criar lembrete');
    }
  });

  return {
    form,
    onSubmit,
    isPending: createReminder.isPending,
  };
}
