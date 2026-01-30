import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import type { DownloadQueueItem, DownloadQueueRequest } from '../@interface/download-request.types';

const downloadQueueKeys = {
  all: ['download-queue'] as const,
  byEnterprise: (idEnterprise?: string) => [...downloadQueueKeys.all, idEnterprise] as const,
};

async function fetchDownloadQueue(idEnterprise?: string): Promise<DownloadQueueItem[]> {
  if (!idEnterprise) return [];
  const response = await api.get<DownloadQueueItem[]>(`/download-queue?idEnterprise=${idEnterprise}`);
  return response.data || [];
}

export function useDownloadQueueQuery(idEnterprise?: string) {
  return useQuery({
    queryKey: downloadQueueKeys.byEnterprise(idEnterprise),
    queryFn: () => fetchDownloadQueue(idEnterprise),
    enabled: !!idEnterprise,
  });
}

export function useDownloadQueueApi(idEnterprise?: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const createRequest = useMutation({
    mutationFn: async (data: DownloadQueueRequest) => {
      const response = await api.post('/download-queue', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: downloadQueueKeys.byEnterprise(idEnterprise) });
      toast.success(t('save.success'));
    },
    onError: () => {
      toast.error(t('error.save'));
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/download-queue/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: downloadQueueKeys.byEnterprise(idEnterprise) });
      toast.success(t('delete.success'));
    },
    onError: () => {
      toast.error(t('error.delete'));
    },
  });

  return { createRequest, deleteRequest };
}
