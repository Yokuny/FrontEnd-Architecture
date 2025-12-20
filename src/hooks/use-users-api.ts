import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PasswordUpdate, User, UserListItem, UserPermission } from '@/routes/_private/permissions/users/@interface/user';

const API_BASE = '/api';

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  enterprises: (id: string) => [...usersKeys.all, 'enterprises', id] as const,
};

// API functions
async function fetchUsers(params?: Record<string, unknown>): Promise<{ data: UserListItem[]; pageInfo: any[] }> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const response = await fetch(`${API_BASE}/user/enterprise/list${queryString}`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

async function fetchUsersByEnterprise(idEnterprise: string): Promise<UserListItem[]> {
  const response = await fetch(`${API_BASE}/user/list/enterprise?id=${idEnterprise}`);
  if (!response.ok) throw new Error('Failed to fetch users by enterprise');
  return response.json();
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`${API_BASE}/user/find/details?id=${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

async function createUser(user: Partial<User>): Promise<User> {
  const response = await fetch(`${API_BASE}/user/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

async function updateUser(user: User): Promise<User> {
  const response = await fetch(`${API_BASE}/user/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/user/delete?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
}

async function disableUser(id: string, reason: string): Promise<void> {
  const response = await fetch(`${API_BASE}/user/disable`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, reason }),
  });
  if (!response.ok) throw new Error('Failed to disable user');
}

async function enableUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/user/enable`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error('Failed to enable user');
}

async function updatePassword(data: PasswordUpdate): Promise<void> {
  const response = await fetch(`${API_BASE}/user/password/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update password');
}

async function addUserPermission(permission: UserPermission): Promise<UserPermission> {
  const response = await fetch(`${API_BASE}/user/enterprise`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permission),
  });
  if (!response.ok) throw new Error('Failed to add permission');
  return response.json();
}

async function updateUserPermission(permission: UserPermission): Promise<UserPermission> {
  const response = await fetch(`${API_BASE}/user/enterprise`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permission),
  });
  if (!response.ok) throw new Error('Failed to update permission');
  return response.json();
}

async function deleteUserPermission(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/user/enterprise?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete permission');
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
    addPermission: addPermissionMutation,
    updatePermission: updatePermissionMutation,
    deletePermission: deletePermissionMutation,
  };
}
