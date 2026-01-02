import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface UserType {
  id: string;
  description: string;
  color: string;
  enterprise?: {
    id: string;
    name: string;
  };
}

export interface UserTypeFormData {
  id?: string;
  idEnterprise: string;
  description: string;
  color: string;
}

// Query keys
export const userTypesKeys = {
  all: ['user-types'] as const,
  lists: () => [...userTypesKeys.all, 'list'] as const,
  list: (idEnterprise?: string) => [...userTypesKeys.all, 'list', idEnterprise || 'all'] as const,
  detail: (id: string) => [...userTypesKeys.all, 'detail', id] as const,
};

// API functions
async function fetchUserTypes(idEnterprise?: string): Promise<UserType[]> {
  const url = `/typeuser/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`;
  const response = await api.get<UserType[]>(url);
  return response.data;
}

async function fetchUserType(id: string): Promise<UserType> {
  const response = await api.get<UserType>(`/typeuser?id=${id}`);
  return response.data;
}

// Hooks
export function useUserTypes(idEnterprise?: string) {
  return useQuery({
    queryKey: userTypesKeys.list(idEnterprise),
    queryFn: () => fetchUserTypes(idEnterprise),
  });
}

export function useUserType(id?: string) {
  return useQuery({
    queryKey: userTypesKeys.detail(id as string),
    queryFn: () => fetchUserType(id as string),
    enabled: !!id,
  });
}

export function useUserTypesApi() {
  const queryClient = useQueryClient();

  const createUserType = useMutation({
    mutationFn: (data: UserTypeFormData) => api.post('/typeuser', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userTypesKeys.lists() }),
  });

  const updateUserType = useMutation({
    mutationFn: (data: UserTypeFormData) => api.post('/typeuser', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userTypesKeys.lists() }),
  });

  const deleteUserType = useMutation({
    mutationFn: (id: string) => api.delete(`/typeuser?id=${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userTypesKeys.lists() }),
  });

  return { createUserType, updateUserType, deleteUserType };
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
