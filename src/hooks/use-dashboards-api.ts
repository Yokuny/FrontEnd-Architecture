import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Dashboard } from '@/routes/_private/telemetry/list-dashboard/@interface/dashboard.types';

// Query keys
export const dashboardsKeys = {
  all: ['dashboards'] as const,
  lists: () => [...dashboardsKeys.all, 'list'] as const,
  list: (filters?: any) => [...dashboardsKeys.lists(), filters] as const,
  details: () => [...dashboardsKeys.all, 'detail'] as const,
  detail: (id: string) => [...dashboardsKeys.details(), id] as const,
};

// API functions
async function fetchDashboards(filters?: any): Promise<{ data: Dashboard[]; totalCount: number }> {
  // Add default pagination and filter cleanup
  const params = {
    page: 0,
    size: 10,
    ...filters,
  };

  const response = await api.get<any>('/dashboard/list', { params });

  // Standardize response based on legacy backend pattern
  const data = response.data?.data || [];

  // Try to find count in pageInfo array (legacy pattern)
  const totalCount = response.data?.pageInfo?.[0]?.count ?? data.length;

  return { data, totalCount };
}

async function fetchDashboardFolderFiles(id: string): Promise<Dashboard[]> {
  const response = await api.get<Dashboard[]>(`/dashboard/folder/files?id=${id}`);
  return response.data;
}

async function fetchDashboard(id: string): Promise<Dashboard> {
  const response = await api.get<Dashboard>(`/dashboard/find?id=${id}`);
  return response.data;
}

async function saveDashboard(data: any): Promise<void> {
  await api.post('/dashboard', data);
}

// Hooks
export function useDashboards(filters?: any) {
  return useQuery({
    queryKey: dashboardsKeys.list(filters),
    queryFn: () => fetchDashboards(filters),
  });
}

export function useDashboardFolderFiles(id: string | undefined, enabled: boolean = false) {
  return useQuery({
    queryKey: [...dashboardsKeys.all, 'folder', id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return fetchDashboardFolderFiles(id);
    },
    enabled: !!id && enabled,
  });
}

export function useDashboard(id: string | undefined) {
  return useQuery({
    queryKey: dashboardsKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return fetchDashboard(id);
    },
    enabled: !!id,
  });
}

export function useSaveDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDashboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardsKeys.details() });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/dashboard/delete?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardsKeys.lists() });
    },
  });
}
