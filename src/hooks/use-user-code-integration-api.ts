import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface UserCodeIntegration {
  id: string;
  name: string;
  userId: string;
  codeIntegrationUser: string | null;
}

// Query keys
export const userCodeIntegrationKeys = {
  all: ['user-code-integration'] as const,
  list: () => [...userCodeIntegrationKeys.all, 'list'] as const,
};

// API functions
async function fetchUserCodeIntegration(): Promise<UserCodeIntegration[]> {
  const response = await api.get<UserCodeIntegration[]>('/user/list/codeintegration');
  return response.data;
}

// Hooks
export function useUserCodeIntegration() {
  return useQuery({
    queryKey: userCodeIntegrationKeys.list(),
    queryFn: fetchUserCodeIntegration,
  });
}

// Helper hook for select components
export function useUserCodeIntegrationSelect() {
  return useUserCodeIntegration();
}

// Helper function to map to select options
export function mapUserCodeIntegrationToOptions(users: UserCodeIntegration[]) {
  return users
    .map((user) => ({
      value: user.id,
      label: `${user.name} - (${user.codeIntegrationUser || '-'})`,
      data: user,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
