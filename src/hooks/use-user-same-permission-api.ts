import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface UserSamePermission {
  id: string;
  name: string;
}

// Query keys
export const userSamePermissionKeys = {
  all: ['user-same-permission'] as const,
  list: () => [...userSamePermissionKeys.all, 'list'] as const,
};

// API functions
async function fetchUserSamePermission(): Promise<UserSamePermission[]> {
  const response = await api.get<UserSamePermission[]>('/user/list/sameenterprises');
  return response.data;
}

// Hooks
export function useUserSamePermission() {
  return useQuery({
    queryKey: userSamePermissionKeys.list(),
    queryFn: fetchUserSamePermission,
  });
}

// Helper hook for select components
export function useUserSamePermissionSelect() {
  return useUserSamePermission();
}

// Helper function to map to select options
export function mapUserSamePermissionToOptions(users: UserSamePermission[]) {
  return users
    .map((user) => ({
      value: user.id,
      label: user.name,
      data: user,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
