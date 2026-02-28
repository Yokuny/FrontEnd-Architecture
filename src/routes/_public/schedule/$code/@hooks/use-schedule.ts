import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const publicScheduleKeys = {
  all: ['publicSchedule'] as const,
  passkey: (code: string) => [...publicScheduleKeys.all, 'passkey', code] as const,
};

async function fetchPasskey(code: string) {
  const res = await api.get<{ success: boolean; data: any; message: string }>(`/passkey/${code}`);
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.data;
}

/** Server State do agendamento via link público (passkey). */
export function usePublicSchedulePasskey(code: string) {
  return useQuery({
    queryKey: publicScheduleKeys.passkey(code),
    queryFn: () => fetchPasskey(code),
    enabled: !!code,
    retry: false,
  });
}

/** Mutation para confirmar ou cancelar presença no agendamento. */
export function useConfirmPresence() {
  return useMutation({
    mutationFn: async ({ scheduleID, status }: { scheduleID: string; status: 'confirmed' | 'canceled_by_patient' }) => {
      const res = await api.put<{ success: boolean; message: string }>(`/schedule/confirm/${scheduleID}`, { status });
      if (!res.data.success) throw new Error(res.data.message);
      return res.data;
    },
  });
}
