import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET, PATCH, request } from '@/lib/api/client';
import type { DbReminder } from '@/lib/interfaces';
import type { ReminderBulkUpdate, ReminderQuery } from '@/lib/interfaces/schemas/reminder.schema';

export const remindersKeys = {
  all: ['reminders'] as const,
  lists: () => [...remindersKeys.all, 'list'] as const,
  list: (query: ReminderQuery) => [...remindersKeys.lists(), query] as const,
};

async function fetchReminders(query: ReminderQuery): Promise<DbReminder[]> {
  const params = new URLSearchParams();
  params.append('startDate', query.startDate);
  params.append('endDate', query.endDate);
  if (query.status) params.append('status', query.status);

  const res = await request(`reminder?${params.toString()}`, GET());
  if (!res.success) throw new Error(res.message || 'Falha ao carregar lembretes');
  return res.data as DbReminder[];
}

export function useRemindersQuery(query: ReminderQuery) {
  return useQuery({
    queryKey: remindersKeys.list(query),
    queryFn: () => fetchReminders(query),
    enabled: !!query.startDate && !!query.endDate,
  });
}

export function useCheckReminders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReminderBulkUpdate) => {
      const res = await request('reminder', PATCH(data));
      if (!res.success) throw new Error(res.message || 'Falha ao marcar lembretes como concluídos');
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersKeys.lists() });
    },
  });
}
