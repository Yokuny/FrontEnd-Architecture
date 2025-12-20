import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface TypeProblem {
  id: string;
  description: string;
}

// Query keys
export const typeProblemsKeys = {
  all: ['type-problems'] as const,
  byEnterprise: (id: string) => [...typeProblemsKeys.all, 'enterprise', id] as const,
};

// API functions
async function fetchTypeProblemsByEnterprise(idEnterprise: string): Promise<TypeProblem[]> {
  const response = await api.get<TypeProblem[]>(`/typeproblem/find/enterprise?id=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useTypeProblemsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: typeProblemsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchTypeProblemsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useTypeProblemsSelect(idEnterprise: string | undefined) {
  return useTypeProblemsByEnterprise(idEnterprise);
}

// Helper function to map type problems to select options
export function mapTypeProblemsToOptions(problems: TypeProblem[]) {
  return problems
    .map((problem) => ({
      value: problem.id,
      label: problem.description,
      data: problem,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
