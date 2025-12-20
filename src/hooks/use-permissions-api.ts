import { useQuery } from '@tanstack/react-query';
import type { RoleListItem, UserType } from '@/routes/_private/permissions/roles/@interface/role';

// API base URL
const API_BASE = '/api';

// Query keys
export const permissionsKeys = {
  allRoles: ['permissions', 'all-roles'] as const,
  userTypes: (idEnterprise?: string) => ['permissions', 'user-types', idEnterprise] as const,
};

// API functions
async function fetchAllRoles(): Promise<RoleListItem[]> {
  const response = await fetch(`${API_BASE}/role/list/all`);
  if (!response.ok) throw new Error('Failed to fetch all roles');
  return response.json();
}

async function fetchUserTypes(idEnterprise?: string): Promise<UserType[]> {
  const queryString = idEnterprise ? `?idEnterprise=${idEnterprise}` : '';
  const response = await fetch(`${API_BASE}/typeuser/list/all${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch user types');
  return response.json();
}

// Hooks
export function useAllRoles() {
  return useQuery({
    queryKey: permissionsKeys.allRoles,
    queryFn: fetchAllRoles,
  });
}

export function useUserTypes(idEnterprise?: string) {
  return useQuery({
    queryKey: permissionsKeys.userTypes(idEnterprise),
    queryFn: () => fetchUserTypes(idEnterprise),
    enabled: !!idEnterprise,
  });
}
