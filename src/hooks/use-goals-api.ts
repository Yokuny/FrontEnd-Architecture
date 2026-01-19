import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Query keys centralizadas
export const goalsKeys = {
  all: ['goals'] as const,
  lists: () => [...goalsKeys.all, 'list'] as const,
  byEnterprise: (idEnterprise: string) => [...goalsKeys.all, 'enterprise', idEnterprise] as const,
  detail: (id: string) => [...goalsKeys.all, 'detail', id] as const,
};

export interface GoalEntry {
  idMachine: string | null;
  date: string;
  value: number;
  isFleet: boolean;
  machine?: {
    id: string;
    name: string;
  };
}

export interface Goal {
  id: string;
  _id?: string;
  idEnterprise: string;
  name: string;
  type: string;
  year: number;
  goals: GoalEntry[];
  enterprise?: {
    id: string;
    name: string;
  };
  appliedPermissions?: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

export interface GoalsListResponse {
  data: Goal[];
  pageInfo?: Array<{ count: number }>;
}

// Hook para listar goals por empresa
export function useGoalsByEnterprise(idEnterprise: string) {
  return useQuery({
    queryKey: goalsKeys.byEnterprise(idEnterprise),
    queryFn: async () => {
      if (!idEnterprise) return { data: [] };
      const response = await api.get(`/goals/enterprise/${idEnterprise}`);

      // Normalização: Se o back-end retornar um array direto (comportamento legado ou não paginado),
      // envolvemos no objeto GoalsListResponse para manter a consistência com o front-end.
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pageInfo: [{ count: response.data.length }],
        } as GoalsListResponse;
      }

      return response.data as GoalsListResponse;
    },
    enabled: !!idEnterprise,
  });
}

// Hook para obter detalhes de um goal
export function useGoal(id: string) {
  return useQuery({
    queryKey: goalsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/goals/${id}`);
      // Legacy behavior: returns array, find the one with matching id
      if (Array.isArray(response.data)) {
        const found = response.data.find((item: any) => item.id === id);
        return { ...found, goals: response.data } as Goal;
      }
      return response.data as Goal;
    },
    enabled: !!id,
  });
}

// Hook de Mutations
export function useGoalsApi() {
  const queryClient = useQueryClient();

  const createGoal = useMutation({
    mutationFn: (data: Partial<Goal>) => api.post('/goals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });

  const updateGoal = useMutation({
    mutationFn: ({ data }: { id: string; data: Partial<Goal> }) => api.put('/goals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: (id: string) => api.delete(`/goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });

  return { createGoal, updateGoal, deleteGoal };
}
