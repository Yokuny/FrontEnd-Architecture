import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  language?: string;
  active?: boolean;
}

export interface UserSelectOption {
  value: string;
  label: string;
  email?: string;
  language?: string;
}

// Query keys
export const usersSelectKeys = {
  all: ['users-select'] as const,
  byEnterprise: (idEnterprise: string) => [...usersSelectKeys.all, 'enterprise', idEnterprise] as const,
  byEnterpriseDetailed: (idEnterprise: string) => [...usersSelectKeys.all, 'enterprise-detailed', idEnterprise] as const,
};

// API functions
async function fetchUsersByEnterprise(idEnterprise: string, detailed = false): Promise<User[]> {
  const endpoint = detailed ? `/user/list/enterprise/details?id=${idEnterprise}` : `/user/list/enterprise?id=${idEnterprise}`;
  const response = await api.get<User[]>(endpoint);
  return response.data;
}

// Hooks
export function useUsersByEnterprise(idEnterprise: string | undefined, detailed = false) {
  return useQuery({
    queryKey: detailed ? usersSelectKeys.byEnterpriseDetailed(idEnterprise || '') : usersSelectKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) {
        return Promise.resolve([]);
      }
      return fetchUsersByEnterprise(idEnterprise, detailed);
    },
    enabled: !!idEnterprise,
  });
}

// Helper function to map users to select options
export function mapUsersToOptions(users: User[], includeDetails = false): UserSelectOption[] {
  return users
    .map((user) =>
      includeDetails
        ? {
            value: user.id,
            label: user.name,
            email: user.email,
            language: user.language,
          }
        : {
            value: user.id,
            label: user.name,
          },
    )
    .sort((a, b) => a.label.localeCompare(b.label));
}
