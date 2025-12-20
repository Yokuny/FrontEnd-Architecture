import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface ContractAsset {
  id: string;
  name: string;
}

export interface OperationByAsset {
  idOperation: string;
  name: string;
}

// Query keys
export const contractAssetsKeys = {
  all: ['contract-assets'] as const,
  availableByEnterprise: (id: string) => [...contractAssetsKeys.all, 'available', id] as const,
  operationsByAsset: (idEnterprise: string, idMachine: string) => [...contractAssetsKeys.all, 'operations', idEnterprise, idMachine] as const,
};

// API functions
async function fetchContractAssetsAvailableByEnterprise(idEnterprise: string): Promise<ContractAsset[]> {
  const response = await api.get<ContractAsset[]>(`/contract-asset/available-by-enterprise?idEnterprise=${idEnterprise}`);
  return response.data;
}

async function fetchOperationsByAsset(idEnterprise: string, idMachine: string): Promise<OperationByAsset[]> {
  const response = await api.get<OperationByAsset[]>(`/contract-asset/operations-by-asset?idEnterprise=${idEnterprise}&idMachine=${idMachine}`);
  return response.data;
}

// Hooks
export function useContractAssetsAvailable(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: contractAssetsKeys.availableByEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchContractAssetsAvailableByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useContractAssetsAvailableSelect(idEnterprise: string | undefined) {
  return useContractAssetsAvailable(idEnterprise);
}

export function useOperationsByAsset(idEnterprise: string | undefined, idMachine: string | undefined) {
  return useQuery({
    queryKey: contractAssetsKeys.operationsByAsset(idEnterprise || '', idMachine || ''),
    queryFn: () => {
      if (!idEnterprise || !idMachine) return Promise.resolve([]);
      return fetchOperationsByAsset(idEnterprise, idMachine);
    },
    enabled: !!idEnterprise && !!idMachine,
  });
}

export function useOperationsByAssetSelect(idEnterprise: string | undefined, idMachine: string | undefined) {
  return useOperationsByAsset(idEnterprise, idMachine);
}

// Helper function to map contract assets to select options
export function mapContractAssetsToOptions(assets: ContractAsset[]) {
  return assets
    .map((asset) => ({
      value: asset.id,
      label: asset.name,
      data: asset,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function mapOperationsByAssetToOptions(operations: OperationByAsset[]) {
  return operations
    .map((op) => ({
      value: op.idOperation,
      label: `${op.idOperation} - ${op.name}`,
      data: op,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
