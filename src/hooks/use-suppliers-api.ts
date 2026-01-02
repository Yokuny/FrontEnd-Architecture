import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Supplier {
  razao: string;
  status: string;
  atividades: string[];
  // Add other fields as needed
}

export interface SupplierSelectOption {
  value: string;
  label: string;
  disabled: boolean;
  atividades: string[];
  data: Supplier;
}

// Query keys
export const suppliersKeys = {
  all: ['suppliers'] as const,
  lists: () => [...suppliersKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...suppliersKeys.lists(), filters] as const,
};

// API functions
async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>('/fas/suricatta-supplier/fornecedores');
  return response.data;
}

// Hooks
export function useSuppliers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: suppliersKeys.list(params),
    queryFn: fetchSuppliers,
  });
}

// Helper hook for select components
export function useSuppliersSelect() {
  return useSuppliers();
}

// Helper function to map suppliers to select options
export function mapSuppliersToOptions(suppliers: Supplier[]): SupplierSelectOption[] {
  return suppliers
    .map((supplier) => ({
      value: supplier.razao, // Using razao as value since id is not apparent
      label: supplier.razao,
      disabled: supplier.status !== 'Aprovado',
      atividades: supplier.atividades,
      data: supplier,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// Helper function to get unique activities
export function getSupplierActivities(suppliers: Supplier[]): string[] {
  const activities = new Set<string>();
  for (const supplier of suppliers) {
    if (supplier.atividades) {
      for (const activity of supplier.atividades) {
        activities.add(activity);
      }
    }
  }
  return Array.from(activities).sort((a, b) => a.localeCompare(b));
}
