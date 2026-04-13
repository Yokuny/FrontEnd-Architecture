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
      const result = await createReminder.mutateAsync(data);
      toast.success(result.message);
      navigate({ to: '/reminders', search: { showAll: true, page: 1, size: 10 } });
    } catch {
      // error handled globally via MutationCache.onError
    }
  });

  return {
    form,
    onSubmit,
    isPending: createReminder.isPending,
  };
}
