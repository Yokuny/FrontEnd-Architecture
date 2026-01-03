import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { api } from '@/lib/api/client';
import type { PasswordUpdate, User, UserListItem, UserPermission } from '@/routes/_private/permissions/users/@interface/user';

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  enterprises: (id: string) => [...usersKeys.all, 'enterprises', id] as const,
  permissions: () => [...usersKeys.all, 'permissions'] as const,
  permission: (id: string) => [...usersKeys.permissions(), id] as const,
};

// API functions
async function fetchUsers(params?: Record<string, unknown>): Promise<{ data: UserListItem[]; pageInfo: { count: number }[] }> {
  // Garantir que temos o idEnterprise
  const idEnterprise = (params?.idEnterprise as string) || useEnterpriseFilter.getState().idEnterprise || '';
  const queryParams = { ...params, idEnterprise };

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      // Use bracket notation for arrays if required by the backend
      const paramKey = key.endsWith('[]') ? key : `${key}[]`;
      for (const item of value) {
        searchParams.append(paramKey, String(item));
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const response = await api.get<{ data: UserListItem[]; pageInfo: { count: number }[] }>(`/user/enterprise/list?${searchParams.toString()}`);
  return response.data;
}

async function fetchUsersByEnterprise(idEnterprise: string): Promise<UserListItem[]> {
  const response = await api.get<UserListItem[]>(`/user/enterprise/list?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchUser(id: string): Promise<User> {
  const response = await api.get<User>(`/user/find/details?id=${id}`);
  return response.data;
}

async function createUser(user: Partial<User>): Promise<User> {
  const response = await api.post<User>('/user/add', user);
  return response.data;
}

async function updateUser(user: User): Promise<User> {
  const response = await api.put<User>('/user/update', user);
  return response.data;
}

async function deleteUser(id: string): Promise<void> {
  await api.delete(`/user/delete?id=${id}`);
}

async function disableUser(id: string, reason: string): Promise<void> {
  await api.put('/user/disable', { id, reason });
}

async function enableUser(id: string): Promise<void> {
  await api.put('/user/enable', { id });
}

async function updatePassword(data: PasswordUpdate): Promise<void> {
  await api.put('/user/password/update', data);
}

async function sendPasswordResetEmail(id: string): Promise<void> {
  await api.post(`/user/password/reset?id=${id}`);
}

async function addUserPermission(permission: UserPermission): Promise<UserPermission> {
  const response = await api.post<UserPermission>('/user/enterprise', permission);
  return response.data;
}

async function updateUserPermission(permission: UserPermission): Promise<UserPermission> {
  const response = await api.put<UserPermission>('/user/enterprise', permission);
  return response.data;
}

async function deleteUserPermission(id: string): Promise<void> {
  await api.delete(`/user/enterprise?id=${id}`);
}

async function fetchUserPermission(id: string): Promise<any> {
  const response = await api.get<any>(`/user/find/userenterprise?id=${id}`);
  return response.data;
}

// Hooks - Query hooks
export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}
export function useUsersByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: usersKeys.enterprises(idEnterprise || ''),
    queryFn: () => fetchUsersByEnterprise(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

export function useUserPermission(id: string) {
  return useQuery({
    queryKey: usersKeys.permission(id),
    queryFn: () => fetchUserPermission(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useUsersApi() {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const disableUserMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => disableUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const enableUserMutation = useMutation({
    mutationFn: enableUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
  });

  const sendPasswordResetEmailMutation = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  const addPermissionMutation = useMutation({
    mutationFn: addUserPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: updateUserPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: deleteUserPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
    disableUser: disableUserMutation,
    enableUser: enableUserMutation,
    updatePassword: updatePasswordMutation,
    sendPasswordResetEmail: sendPasswordResetEmailMutation,
    addPermission: addPermissionMutation,
    updatePermission: updatePermissionMutation,
    deletePermission: deletePermissionMutation,
  };
}
