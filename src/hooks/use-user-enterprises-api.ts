import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Enterprise } from './use-enterprises-api';

// Types
export interface UserEnterprisePreference {
  id: string;
  enterprise: Enterprise;
  preferred: boolean;
}

// Query keys
export const userEnterprisesKeys = {
  all: ['user-enterprises'] as const,
  preferred: () => [...userEnterprisesKeys.all, 'preferred'] as const,
};

// API functions
async function fetchUserEnterprisesPreferred(): Promise<UserEnterprisePreference[]> {
  const response = await api.get<UserEnterprisePreference[]>('/user/enterprises/preferred');
  return response.data;
}

async function updateUserEnterprisePreferred(idEnterprise: string): Promise<void> {
  await api.put('/user/enterprise/preferred', { idEnterprise });
}

// Hooks
export function useUserEnterprisesPreferred() {
  return useQuery({
    queryKey: userEnterprisesKeys.preferred(),
    queryFn: fetchUserEnterprisesPreferred,
  });
}

export function useUpdateUserEnterprisePreferred() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserEnterprisePreferred,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userEnterprisesKeys.preferred() });
    },
  });
}

// Helper hook for select components
export function useUserEnterprisesPreferredSelect() {
  return useUserEnterprisesPreferred();
}

// Helper function to map to select options
export function mapUserEnterprisesPreferredToOptions(data: UserEnterprisePreference[]) {
  return data
    .map((item) => ({
      value: item.enterprise.id,
      label: `${item.enterprise.name} - ${item.enterprise.city} ${item.enterprise.state || ''}`,
      data: item,
      preferred: item.preferred,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
