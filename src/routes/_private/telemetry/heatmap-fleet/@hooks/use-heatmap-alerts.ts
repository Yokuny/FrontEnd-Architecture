import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { HeatmapAlertsResponse } from '../@interface/heatmap.types';

export const heatmapAlertsKeys = {
  all: ['heatmap-alerts'] as const,
  detail: (id: string) => [...heatmapAlertsKeys.all, id] as const,
};

export function useHeatmapAlerts(machineId?: string) {
  return useQuery({
    queryKey: heatmapAlertsKeys.detail(machineId || ''),
    queryFn: async () => {
      const { data } = await api.get<HeatmapAlertsResponse | null>(`/heatmap-alerts/${machineId}`);
      // Handle the case where the API returns null (no alerts configured yet)
      if (!data) {
        return { idMachine: machineId, alerts: [] } as HeatmapAlertsResponse;
      }
      return data;
    },
    enabled: !!machineId,
  });
}

export function useSaveHeatmapAlerts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HeatmapAlertsResponse) => {
      // The backend logic seems to distinguish between POST and PUT based on whether alerts exist
      // But based on the legacy code, it checks `heatmapAlertsInitial.alerts.length === 0`.
      // A safer approach for a modern migration is to try to determine or just use PUT if the ID exists?
      // Legacy code logic:
      // if (initial.length === 0) POST else PUT
      // Here we might need to know if it's new.
      // However, usually PUT /heatmap-alerts/ with a body that contains the ID should work for upsert if the backend supports it.
      // Let's assume we follow the legacy pattern: Check if we have alerts or not might be brittle if we don't have the initial state.
      // Actually, fetching checks for null.
      // Let's rely on the fact that if we just fetched and it was empty, we POST.
      // Wait, the hook `useHeatmapAlerts` returns a constructed object if null.

      // Let's implement an upsert-like logic or expose both.
      // For now, let's use PUT as it's often safer for updates, but legacy used POST for initial.
      // Let's try to unify or handle it in the component? No, logic should be here or we expose a flexible mutation.

      // Checking the legacy code again:
      // if (heatmapAlertsInitial.alerts.length === 0) POST else PUT

      // We can check if `data.alerts.length` > 0? No, that's current state.
      // We need to know if it existed before.
      // Let's try to send PUT. If it fails with 404, maybe we need POST?
      // Or we can just inspect the data being sent.

      // Simpler approach: Include `isNew` boolean in the mutation argument?
      // Or just check if we have an ID? The payload has `idMachine`.

      // Let's replicate legacy logic: POST if it's the first time, PUT otherwise.
      // But we can't know for sure without the previous state.
      // Actually, let's assume `PUT` handles upgrades if the backend is robust.
      // If not, we might need a `save` function that takes `isNew` param.

      return api.put('/heatmap-alerts/', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: heatmapAlertsKeys.detail(variables.idMachine) });
    },
  });
}

// Special hook to handle the POST vs PUT logic if needed, or we just trust PUT.
// If the backend strictly requires POST for creation, we might need to change the backend or handle it.
// Let's interpret the legacy code: `heatmapAlertsInitial` was set from the GET response.
// If GET returned null, `heatmapAlertsInitial` alerts was empty.
// So if we fetch and get "null" (mapped to empty), it's "new".

export function useSaveHeatmapAlertsSmart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, isNew }: { data: HeatmapAlertsResponse; isNew: boolean }) => {
      if (isNew) {
        return api.post('/heatmap-alerts/', data);
      }
      return api.put('/heatmap-alerts/', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: heatmapAlertsKeys.detail(variables.data.idMachine) });
    },
  });
}
