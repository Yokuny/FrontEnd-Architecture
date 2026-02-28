import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const publicScheduleKeys = {
  all: ['publicSchedule'] as const,
  passkey: (code: string) => [...publicScheduleKeys.all, 'passkey', code] as const,
};

export function usePublicScheduleApi() {
  const getPasskey = (code: string) =>
    useQuery({
      queryKey: publicScheduleKeys.passkey(code),
      queryFn: async () => {
        // According to `requestById.helper.ts`, it was a `requestWithoutToken` but `api.get` ignores token if none available.
        // Actually, we should make sure we're getting from the right path.
        const res = await api.get<{ success: boolean; data: any; message: string }>(`/passkey/${code}`);
        if (!res.data.success) throw new Error(res.data.message);
        return res.data.data;
      },
      enabled: !!code,
      retry: false,
    });

  const confirmPresence = useMutation({
    mutationFn: async ({ scheduleID, status }: { scheduleID: string; status: 'confirmed' | 'canceled_by_patient' }) => {
      const res = await api.put<{ success: boolean; message: string }>(`/schedule/confirm/${scheduleID}`, { status });
      if (!res.data.success) throw new Error(res.data.message);
      return res.data;
    },
  });

  return { getPasskey, confirmPresence };
}
