import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ChatbotPermission, PermissionPath, Role, RoleListItem, RoleUser } from '@/routes/_private/permissions/roles/@interface';

export type { ChatbotPermission, PermissionPath, Role, RoleListItem, RoleUser };

// Query keys
export const rolesKeys = {
  all: ['roles'] as const,
  lists: () => [...rolesKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...rolesKeys.lists(), filters] as const,
  details: () => [...rolesKeys.all, 'detail'] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
  paths: () => [...rolesKeys.all, 'paths'] as const,
  chatbotPermissions: () => [...rolesKeys.all, 'chatbot-permissions'] as const,
  users: (id: string) => [...rolesKeys.all, 'users', id] as const,
};

// API functions
async function fetchRoles(params?: Record<string, unknown>): Promise<{ data: RoleListItem[]; pageInfo: { count: number }[] }> {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;

      if (Array.isArray(value)) {
        const paramKey = key.endsWith('[]') ? key : `${key}[]`;
        for (const item of value) {
          searchParams.append(paramKey, String(item));
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  }

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const response = await api.get<{ data: RoleListItem[]; pageInfo: { count: number }[] }>(`/role/list${queryString}`);
  return response.data;
}

async function fetchRolesAll(): Promise<RoleListItem[]> {
  const response = await api.get<RoleListItem[]>('/role/list/all');
  return response.data;
}

async function fetchRole(id: string): Promise<Role> {
  const response = await api.get<Role>(`/role?id=${id}`);
  return response.data;
}

async function createRole(role: Partial<Role>): Promise<Role> {
  const response = await api.post<Role>('/role', role);
  return response.data;
}

async function updateRole(role: Role): Promise<Role> {
  const response = await api.post<Role>('/role', role);
  return response.data;
}

async function deleteRole(id: string, idEnterprise: string): Promise<void> {
  await api.delete(`/role?id=${id}&idEnterprise=${idEnterprise}`);
}

async function deleteRoleWithUsers(idRole: string, idEnterprise: string): Promise<void> {
  await api.delete(`/role/removewithusers?idRole=${idRole}&idEnterprise=${idEnterprise}`);
}

async function fetchRolePaths(): Promise<PermissionPath[]> {
  const response = await api.get<PermissionPath[]>('/role/paths');
  return response.data;
}

async function fetchChatbotPermissions(): Promise<ChatbotPermission[]> {
  const response = await api.get<ChatbotPermission[]>('/role/chatbotallowed');
  return response.data;
}

async function fetchRoleUsers(idRole: string, idEnterprise: string): Promise<RoleUser[]> {
  const response = await api.get<RoleUser[]>(`/role/list/usersid-enterprise?idRole=${idRole}&idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchUsersByRoleAndEnterprise(idRole: string, idEnterprise: string): Promise<{ users: { id: string; name: string }[] }> {
  const response = await api.get<{ users: { id: string; name: string }[] }>(`/role/list/usersid-and-identerprise?idRole=${idRole}&idEnterprise=${idEnterprise}`);
  return response.data;
}

async function removeUserFromRole(idUser: string, idRole: string, idEnterprise: string): Promise<void> {
  await api.put('/role/remove-role-userid', { idUser, idRole, idEnterprise });
}

// Hooks - Query hooks
export function useRoles(params?: Record<string, unknown>, enabled = true) {
  return useQuery({
    queryKey: rolesKeys.list(params),
    queryFn: () => fetchRoles(params),
    enabled,
  });
}

export function useRolesAll(enabled = true) {
  return useQuery({
    queryKey: [...rolesKeys.all, 'all'],
    queryFn: fetchRolesAll,
    enabled,
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: () => fetchRole(id),
    enabled: !!id,
  });
}

export function useRolePaths() {
  return useQuery({
    queryKey: rolesKeys.paths(),
    queryFn: fetchRolePaths,
  });
}

export function useChatbotPermissions() {
  return useQuery({
    queryKey: rolesKeys.chatbotPermissions(),
    queryFn: fetchChatbotPermissions,
  });
}

export function useRoleUsers(idRole: string, idEnterprise: string) {
  return useQuery({
    queryKey: rolesKeys.users(idRole),
    queryFn: () => fetchRoleUsers(idRole, idEnterprise),
    enabled: !!idRole && !!idEnterprise,
  });
}

export function useUsersByRoleAndEnterprise(idRole: string | undefined, idEnterprise: string | undefined) {
  return useQuery({
    queryKey: [...rolesKeys.all, 'users-by-role-enterprise', idRole, idEnterprise],
    queryFn: () => fetchUsersByRoleAndEnterprise(idRole as string, idEnterprise as string),
    enabled: !!idRole && !!idEnterprise,
  });
}

// Mutation hooks
export function useRolesApi() {
  const queryClient = useQueryClient();

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: rolesKeys.detail(data.id) });
      }
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: ({ id, idEnterprise }: { id: string; idEnterprise: string }) => deleteRole(id, idEnterprise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });

  // Delete role with users mutation
  const deleteRoleWithUsersMutation = useMutation({
    mutationFn: ({ idRole, idEnterprise }: { idRole: string; idEnterprise: string }) => deleteRoleWithUsers(idRole, idEnterprise),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });

  // Remove user from role mutation
  const removeUserFromRoleMutation = useMutation({
    mutationFn: ({ idUser, idRole, idEnterprise }: { idUser: string; idRole: string; idEnterprise: string }) => removeUserFromRole(idUser, idRole, idEnterprise),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.users(variables.idRole) });
    },
  });

  return {
    createRole: createRoleMutation,
    updateRole: updateRoleMutation,
    deleteRole: deleteRoleMutation,
    deleteRoleWithUsers: deleteRoleWithUsersMutation,
    removeUserFromRole: removeUserFromRoleMutation,
  };
}

// Helper hook for select components
export function useRolesSelect(isAll = false, params?: Record<string, unknown>) {
  const allQuery = useRolesAll(isAll);
  const filterQuery = useRoles(params, !isAll);
  return isAll ? allQuery : filterQuery;
}

// Helper function to map roles to select options
export function mapRolesToOptions(roles: RoleListItem[] | { data: RoleListItem[] }) {
  const items = Array.isArray(roles) ? roles : roles.data;
  return items
    .map((role) => ({
      value: role.id,
      label: role.description,
      data: role,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
