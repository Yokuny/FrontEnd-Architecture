import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ExternalUser } from '../@interface/external-user';

export const externalUserKeys = {
  all: ['external-users'] as const,
  list: (idEnterprise: string) => [...externalUserKeys.all, 'list', idEnterprise] as const,
};

async function fetchExternalUsers(idEnterprise: string): Promise<ExternalUser[]> {
  const response = await api.get<ExternalUser[]>(`/userexternalintegration/list/enterprise?idEnterprise=${idEnterprise}`);
  return response.data || [];
}

async function createExternalUser(data: { idEnterprise: string; username: string }): Promise<ExternalUser> {
  const response = await api.post<ExternalUser>('/userexternalintegration', data);
  return response.data;
}

async function updateExternalUserStatus(data: { id: string; active: boolean }): Promise<void> {
  await api.patch('/userexternalintegration/active', data);
}

export function useExternalUsers(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: externalUserKeys.list(idEnterprise || ''),
    queryFn: () => fetchExternalUsers(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

export function useExternalUsersApi() {
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: createExternalUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: externalUserKeys.list(variables.idEnterprise) });
    },
  });

  const updateStatus = useMutation({
    mutationFn: updateExternalUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalUserKeys.all });
    },
  });

  return { createUser, updateStatus };
}
