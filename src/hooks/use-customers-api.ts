import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Customer {
  id: string;
  name: string;
  code?: string;
  color?: string;
  enterprise?: {
    id: string;
    name: string;
  };
  active?: boolean;
}

export interface CustomersSearchParams {
  page?: number;
  size?: number;
  search?: string;
  idEnterprise?: string;
}

export interface CustomersListResponse {
  data: Customer[];
  pageInfo: Array<{
    count: number;
    page: number;
    size: number;
  }>;
}

// Query keys
export const customersKeys = {
  all: ['customers'] as const,
  lists: () => [...customersKeys.all, 'list'] as const,
  byEnterprise: (id: string) => [...customersKeys.all, 'enterprise', id] as const,
  paginated: (params: CustomersSearchParams) => [...customersKeys.lists(), params] as const,
  detail: (id: string) => [...customersKeys.all, 'detail', id] as const,
};

// API functions
async function fetchCustomersByEnterprise(idEnterprise: string): Promise<Customer[]> {
  const response = await api.get<Customer[]>(`/customer/list/all?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchCustomersPaginated(params: CustomersSearchParams): Promise<CustomersListResponse> {
  const { data } = await api.get<CustomersListResponse>('/customer/list', { params });
  return data;
}

async function fetchCustomer(id: string): Promise<Customer> {
  const { data } = await api.get<Customer>(`/customer`, { params: { id } });
  return data;
}

async function createUpdateCustomer(customer: Partial<Customer>): Promise<Customer> {
  const { data } = await api.post<Customer>('/customer', customer);
  return data;
}

async function deleteCustomer(id: string): Promise<void> {
  await api.delete('/customer', { params: { id } });
}

// Hooks
export function useCustomersByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: customersKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchCustomersByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

export function useCustomersPaginated(params: CustomersSearchParams) {
  return useQuery({
    queryKey: customersKeys.paginated(params),
    queryFn: () => fetchCustomersPaginated(params),
    placeholderData: (previousData) => previousData,
    enabled: !!params.idEnterprise,
  });
}

export function useCustomer(id: string | null) {
  return useQuery({
    queryKey: customersKeys.detail(id || ''),
    queryFn: () => fetchCustomer(id || ''),
    enabled: !!id,
  });
}

export function useCustomersApi() {
  const queryClient = useQueryClient();

  const createUpdate = useMutation({
    mutationFn: createUpdateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customersKeys.all });
    },
  });

  const remove = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });

  return {
    createUpdate,
    remove,
  };
}

// Helper hook for select components
export function useCustomersSelect(idEnterprise: string | undefined) {
  return useCustomersByEnterprise(idEnterprise);
}

// Helper function to map customers to select options
export function mapCustomersToOptions(customers: Customer[]) {
  return customers
    .map((customer) => ({
      value: customer.id,
      label: customer.name,
      console: customer.code,
      data: customer,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
