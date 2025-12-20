import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Customer {
  id: string;
  name: string;
}

// Query keys
export const customersKeys = {
  all: ['customers'] as const,
  byEnterprise: (id: string) => [...customersKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchCustomersByEnterprise(idEnterprise: string): Promise<Customer[]> {
  const response = await api.get<Customer[]>(`/customer/list/all?idEnterprise=${idEnterprise}`);
  return response.data;
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
      data: customer,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
