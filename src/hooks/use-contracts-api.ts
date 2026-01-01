import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface GroupConsumption {
  code: string;
  description: string;
  consumption: number;
}

export interface Operation {
  idOperation: string;
  name: string;
  description?: string;
  idGroupConsumption: string;
}

export interface ContractEvent {
  description: string;
  factor: number;
}

export interface Contract {
  id: string;
  idEnterprise: string;
  description: string;
  customer: string;
  competence: 'dayInMonth' | 'eof';
  day?: number | null;
  groupConsumption: GroupConsumption[];
  operations: Operation[];
  events: ContractEvent[];
  enterprise?: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
}

export interface ContractListParams {
  page?: number;
  size?: number;
  search?: string;
  idEnterprise?: string;
}

export interface ContractListResponse {
  data: Contract[];
  pageInfo: { count: number }[];
}

// Query keys
export const contractsKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractsKeys.all, 'list'] as const,
  paginated: (params: ContractListParams) => [...contractsKeys.lists(), 'paginated', params] as const,
  detail: (id: string) => [...contractsKeys.all, 'detail', id] as const,
};

// API functions
async function fetchContractsPaginated(params: ContractListParams): Promise<ContractListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) searchParams.append('page', String(params.page));
  if (params.size !== undefined) searchParams.append('size', String(params.size));
  if (params.search) searchParams.append('search', params.search);
  if (params.idEnterprise) searchParams.append('idEnterprise', params.idEnterprise);

  const response = await api.get<ContractListResponse>(`/contract/list?${searchParams.toString()}`);
  return response.data;
}

async function fetchContract(id: string): Promise<Contract> {
  const response = await api.get<Contract>(`/contract/find?id=${id}`);
  return response.data;
}

async function createContract(contract: Partial<Contract>): Promise<Contract> {
  const response = await api.post<Contract>('/contract', contract);
  return response.data;
}

async function updateContract(contract: Partial<Contract> & { id: string }): Promise<Contract> {
  const response = await api.put<Contract>('/contract', contract);
  return response.data;
}

async function deleteContract(id: string): Promise<void> {
  await api.delete(`/contract?id=${id}`);
}

// Hooks
export function useContractsPaginated(params: ContractListParams) {
  return useQuery({
    queryKey: contractsKeys.paginated(params),
    queryFn: () => fetchContractsPaginated(params),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: contractsKeys.detail(id),
    queryFn: () => fetchContract(id),
    enabled: !!id,
  });
}

export function useContractsApi() {
  const queryClient = useQueryClient();

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
    },
  });

  const updateContractMutation = useMutation({
    mutationFn: updateContract,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: contractsKeys.detail(data.id) });
      }
    },
  });

  const deleteContractMutation = useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractsKeys.lists() });
    },
  });

  return {
    createContract: createContractMutation,
    updateContract: updateContractMutation,
    deleteContract: deleteContractMutation,
  };
}
