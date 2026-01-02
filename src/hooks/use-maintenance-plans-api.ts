import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// TODO: DEPRECATED ???????

// Types
export interface MaintenancePlanEnterprise {
  id: string;
  name: string;
}

export interface MaintenancePlanCycle {
  unity: string;
  value: number;
}

export interface MaintenancePlanWear {
  type: string;
  value: number;
}

export interface ServiceItem {
  id?: string;
  type?: string;
  description?: string;
  observation?: string;
}

export interface ServiceGroup {
  name?: string;
  itens?: ServiceItem[];
}

export interface MaintenancePlan {
  id: string;
  description: string;
  idEnterprise?: string;
  enterprise?: MaintenancePlanEnterprise;
  typeMaintenance?: string;
  daysNotice?: number;
  durationDays?: number;
  maintanceCycle?: MaintenancePlanCycle;
  maintanceWear?: MaintenancePlanWear;
  servicesGrouped?: ServiceGroup[];
  partsCycle?: any[];
}

export interface MaintenancePlanListResponse {
  data: MaintenancePlan[];
  pageInfo?: Array<{ count: number }>;
}

export interface MaintenancePlanFormInput {
  id?: string;
  idEnterprise: string;
  description: string;
  typeMaintenance: string;
  daysNotice?: number;
  durationDays?: number;
  maintanceCycle?: MaintenancePlanCycle;
  maintanceWear?: MaintenancePlanWear;
  servicesGrouped?: ServiceGroup[];
  partsCycle?: any[];
}

// Query keys
export const maintenancePlansKeys = {
  all: ['maintenance-plans'] as const,
  lists: () => [...maintenancePlansKeys.all, 'list'] as const,
  list: (params: { idEnterprise?: string; page?: number; size?: number; search?: string }) => [...maintenancePlansKeys.lists(), params] as const,
  listAll: (idEnterprise?: string) => [...maintenancePlansKeys.all, 'list-all', idEnterprise] as const,
  details: () => [...maintenancePlansKeys.all, 'detail'] as const,
  detail: (id?: string) => [...maintenancePlansKeys.details(), id] as const,
  typeServiceMaintenance: () => [...maintenancePlansKeys.all, 'type-service-maintenance'] as const,
};

// API functions

/**
 * List maintenance plans with pagination (used in list page)
 * Legacy: GET /maintenanceplan/list (with filterEnterprise from ListSearchPaginated)
 */
async function fetchMaintenancePlansList(params: { idEnterprise?: string; page?: number; size?: number; search?: string }): Promise<MaintenancePlanListResponse> {
  const queryParams = new URLSearchParams();
  if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);
  if (params.page !== undefined) queryParams.append('page', String(params.page));
  if (params.size !== undefined) queryParams.append('size', String(params.size));
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get<MaintenancePlanListResponse>(`/maintenanceplan/list?${queryParams.toString()}`);
  return response.data;
}

/**
 * List all maintenance plans (for select components)
 * Legacy: GET /maintenanceplan/list/all?idEnterprise=${idEnterprise}
 */
async function fetchMaintenancePlansAll(idEnterprise: string): Promise<MaintenancePlan[]> {
  const response = await api.get<MaintenancePlan[]>(`/maintenanceplan/list/all?idEnterprise=${idEnterprise}`);
  return response.data;
}

/**
 * Find maintenance plan by ID
 * Legacy: GET /maintenanceplan/find?id=${id}
 */
async function fetchMaintenancePlanById(id: string): Promise<MaintenancePlan> {
  const response = await api.get<MaintenancePlan>(`/maintenanceplan/find?id=${id}`);
  return response.data;
}

/**
 * Create or update maintenance plan
 * Legacy: POST /maintenanceplan (with data, including id for update)
 */
async function saveMaintenancePlan(data: MaintenancePlanFormInput): Promise<MaintenancePlan> {
  const payload = {
    ...data,
    daysNotice: data.daysNotice ? Number(data.daysNotice) : 0,
    durationDays: data.durationDays ? Number(data.durationDays) : 0,
  };
  const response = await api.post<MaintenancePlan>('/maintenanceplan', payload);
  return response.data;
}

/**
 * Delete maintenance plan by ID
 */
async function deleteMaintenancePlanById(id: string): Promise<void> {
  await api.delete(`/maintenanceplan?id=${id}`);
}

// Hooks

/**
 * Hook for fetching paginated maintenance plans list
 */
export function useMaintenancePlans(params: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: maintenancePlansKeys.list(params),
    queryFn: () => fetchMaintenancePlansList(params),
    enabled: !!params.idEnterprise,
  });
}

/**
 * Hook for fetching all maintenance plans (for select components)
 */
export function useMaintenancePlansAll(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: maintenancePlansKeys.listAll(idEnterprise),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchMaintenancePlansAll(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

/**
 * Hook for fetching a single maintenance plan by ID
 * Legacy: Fetch.get(`/maintenanceplan/find?id=${id}`)
 */
export function useMaintenancePlan(id: string | undefined) {
  return useQuery({
    queryKey: maintenancePlansKeys.detail(id),
    queryFn: () => {
      if (!id) return Promise.resolve(undefined);
      return fetchMaintenancePlanById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook for maintenance plan mutations (create, update, delete)
 */
export function useMaintenancePlansApi() {
  const queryClient = useQueryClient();

  const createMaintenancePlan = useMutation({
    mutationFn: saveMaintenancePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenancePlansKeys.lists() });
    },
  });

  const updateMaintenancePlan = useMutation({
    mutationFn: saveMaintenancePlan,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: maintenancePlansKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: maintenancePlansKeys.detail(variables.id) });
      }
    },
  });
  const deleteMaintenancePlan = useMutation({
    mutationFn: deleteMaintenancePlanById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenancePlansKeys.lists() });
    },
  });

  return {
    createMaintenancePlan,
    updateMaintenancePlan,
    deleteMaintenancePlan,
  };
}

// Helper hook for select components
export function useMaintenancePlansSelect(idEnterprise: string | undefined) {
  return useMaintenancePlansAll(idEnterprise);
}

// Helper function to map maintenance plans to select options
export function mapMaintenancePlansToOptions(plans: MaintenancePlan[]) {
  return plans
    .map((plan) => ({
      value: plan.id,
      label: plan.description,
      data: plan,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
}

// GraphQL Query for Type Service Maintenance (from legacy)
const TYPE_SERVICE_MAINTENANCE_QUERY = `
  query {
    typesServiceMaintenance {
      id
      description
    }
  }
`;

interface TypeServiceMaintenance {
  id: string;
  description: string;
}

interface TypeServiceMaintenanceResponse {
  typesServiceMaintenance: TypeServiceMaintenance[];
}

async function fetchTypeServiceMaintenance(): Promise<TypeServiceMaintenance[]> {
  const response = await api.post<{ data: TypeServiceMaintenanceResponse }>('../../graphql', {
    query: TYPE_SERVICE_MAINTENANCE_QUERY,
  });
  return response.data.data.typesServiceMaintenance || [];
}

/**
 * Hook for fetching type service maintenance options
 */
export function useTypeServiceMaintenance() {
  return useQuery({
    queryKey: maintenancePlansKeys.typeServiceMaintenance(),
    queryFn: fetchTypeServiceMaintenance,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}

/**
 * Map type service maintenance to select options
 */
export function mapTypeServiceMaintenanceToOptions(data: TypeServiceMaintenance[]) {
  return data.map((item) => ({
    value: item.id,
    label: item.description,
    data: item,
  }));
}
