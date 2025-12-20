import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface UserType {
  id: string;
  description: string;
  color: string;
}

// Query keys
export const userTypesKeys = {
  all: ['user-types'] as const,
  list: (idEnterprise?: string) => [...userTypesKeys.all, 'list', idEnterprise || 'all'] as const,
};

// API functions
async function fetchUserTypes(idEnterprise?: string): Promise<UserType[]> {
  const url = `/typeuser/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`;
  const response = await api.get<UserType[]>(url);
  return response.data;
}

// Hooks
export function useUserTypes(idEnterprise?: string) {
  return useQuery({
    queryKey: userTypesKeys.list(idEnterprise),
    queryFn: () => fetchUserTypes(idEnterprise),
  });
}

// Helper hook for select components
export function useUserTypesSelect(idEnterprise?: string) {
  return useUserTypes(idEnterprise);
}

// Helper function to map user types to select options
export function mapUserTypesToOptions(types: UserType[]) {
  return types
    .map((type) => ({
      value: type.id,
      label: type.description,
      data: type,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
