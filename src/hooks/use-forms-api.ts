import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Form {
  id: string;
  description: string;
}

// Query keys
export const formsKeys = {
  all: ['forms'] as const,
  lists: () => [...formsKeys.all, 'list'] as const,
  list: (idEnterprise?: string) => [...formsKeys.lists(), { idEnterprise }] as const,
};

// API functions
async function fetchForms(idEnterprise?: string): Promise<Form[]> {
  const url = `/form/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`;
  const response = await api.get<Form[]>(url);
  return response.data;
}

// Hooks
export function useForms(idEnterprise?: string) {
  return useQuery({
    queryKey: formsKeys.list(idEnterprise),
    queryFn: () => fetchForms(idEnterprise),
  });
}

// Helper hook for select components
export function useFormsSelect(idEnterprise?: string) {
  return useForms(idEnterprise);
}

// Helper function to map forms to select options
export function mapFormsToOptions(forms: Form[]) {
  return forms
    .map((form) => ({
      value: form.id,
      label: form.description,
      data: form,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
