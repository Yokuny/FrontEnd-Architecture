import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Group, GroupsListResponse } from '../routes/_private/operation/groups/@interface/groups.types';

export type { Group, GroupsListResponse };

export const groupsKeys = {
  all: ['groups'] as const,
  lists: (idEnterprise: string) => [...groupsKeys.all, 'list', idEnterprise] as const,
  detail: (id: string) => [...groupsKeys.all, 'detail', id] as const,
};

export function useGroupsByEnterprise(idEnterprise: string) {
  return useQuery({
    queryKey: groupsKeys.lists(idEnterprise),
    queryFn: async () => {
      if (!idEnterprise) return { data: [] };
      const response = await api.get(`/assetstatus/group/list?page=0&size=999&idEnterprise=${idEnterprise}`);

      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          pageInfo: [{ count: response.data.length }],
        } as GroupsListResponse;
      }

      return response.data as GroupsListResponse;
    },
    enabled: !!idEnterprise,
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: groupsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/assetstatus/group/${id}`);
      return response.data as Group;
    },
    enabled: !!id,
  });
}

export function useGroupsApi() {
  const queryClient = useQueryClient();

  const createGroup = useMutation({
    mutationFn: (data: Group) => api.post('/assetstatus/group/', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists(variables.idEnterprise) });
    },
  });

  const updateGroup = useMutation({
    mutationFn: (data: Group) => api.put(`/assetstatus/group/${data.id || data._id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists(variables.idEnterprise) });
      const id = variables.id || variables._id;
      if (id) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.detail(id) });
      }
    },
  });

  const deleteGroup = useMutation({
    mutationFn: (id: string) => api.delete(`/assetstatus/group/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });

  return { createGroup, updateGroup, deleteGroup };
}
