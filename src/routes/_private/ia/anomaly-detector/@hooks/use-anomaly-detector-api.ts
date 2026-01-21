import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { AIAsset, AILastState } from '../@interface/anomaly-detector.types';

export const anomalyKeys = {
  all: ['ai', 'anomaly'] as const,
  assets: (idEnterprise: string) => [...anomalyKeys.all, 'assets', idEnterprise] as const,
  lastStates: (idMachines: string, idEnterprise: string) => [...anomalyKeys.all, 'lastStates', idMachines, idEnterprise] as const,
};

export function useAIAssets(idEnterprise?: string) {
  return useQuery({
    queryKey: anomalyKeys.assets(idEnterprise || ''),
    queryFn: async () => {
      if (!idEnterprise) return [];
      const response = await api.get<AIAsset[]>(`/ai/assets/last?idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}

export function useAIClassify() {
  return useMutation({
    mutationFn: async (payload: { idEnterprise: string; idMachine: string; data: any[] }) => {
      const response = await api.post('/ai/classify', payload);
      return response.data;
    },
  });
}

export function useAILastStates(idMachines?: string, idEnterprise?: string) {
  return useQuery({
    queryKey: anomalyKeys.lastStates(idMachines || '', idEnterprise || ''),
    queryFn: async () => {
      if (!idMachines || !idEnterprise) return [];
      const response = await api.get<AILastState[]>(`/ai/laststates?idMachine=${idMachines}&idEnterprise=${idEnterprise}`);
      return response.data;
    },
    enabled: !!idMachines && !!idEnterprise,
    refetchInterval: 30000,
  });
}
