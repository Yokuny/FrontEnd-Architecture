import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { CmmsActivitiesResponse, FilledFormResponse, FilledFormSearch } from '../@interface/filled-form.schema';

// Query Keys
export const filledFormKeys = {
  all: ['filledForms'] as const,
  lists: () => [...filledFormKeys.all, 'list'] as const,
  list: (params: FilledFormSearch) => [...filledFormKeys.lists(), params] as const,
  activities: (idForm: string, params: Partial<FilledFormSearch>) => [...filledFormKeys.all, 'activities', idForm, params] as const,
};

// API Functions
async function fetchFilledForms(params: FilledFormSearch): Promise<FilledFormResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append('page', String(params.page - 1)); // API uses 0-indexed pages usually, keeping consistent
  if (params.size) searchParams.append('size', String(params.size));
  if (params.search) searchParams.append('search', params.search);

  // Array or string handling
  if (params.machines) {
    const machines = Array.isArray(params.machines) ? params.machines.join(',') : params.machines;
    searchParams.append('machines', machines);
  }

  if (params.status) {
    const status = Array.isArray(params.status) ? params.status.join(',') : params.status;
    searchParams.append('status', status);
  }

  if (params.tipoManutencao) {
    const tipo = Array.isArray(params.tipoManutencao) ? params.tipoManutencao.join(',') : params.tipoManutencao;
    searchParams.append('tipoManutencao', tipo);
  }

  if (params.initialDate) searchParams.append('dateStart', params.initialDate); // Legacy param name
  if (params.finalDate) searchParams.append('dateEnd', params.finalDate); // Legacy param name

  if (params.stockType) searchParams.append('stockType', params.stockType);
  if (params.codigoOperacional) searchParams.append('codigoOperacional', params.codigoOperacional);
  if (params.osCodeJobId) searchParams.append('osCodeJobId', params.osCodeJobId);
  if (params.finishedAt !== undefined) searchParams.append('finishedAt', String(params.finishedAt));
  if (params.equipmentCritical) searchParams.append('equipmentCritical', params.equipmentCritical);
  if (params.inconsistenceType) searchParams.append('inconsistenceType', params.inconsistenceType);

  // CMMS specific logic
  if (params.idForm && params.idForm !== 'undefined') {
    searchParams.append('idForm', params.idForm);
  } else {
    searchParams.append('firstForm', 'CMMS');
  }

  const url = `/formdata/filledlist?${searchParams.toString()}`;
  const response = await api.get<FilledFormResponse>(url);
  return response.data;
}

async function fetchCmmsActivities(idForm: string, params: FilledFormSearch): Promise<CmmsActivitiesResponse> {
  const searchParams = new URLSearchParams();

  // Exact same filters as list, but excluding page/size usually? specific to dashboard logic
  if (params.machines) {
    const machines = Array.isArray(params.machines) ? params.machines.join(',') : params.machines;
    searchParams.append('machines', machines);
  }
  if (params.initialDate) searchParams.append('dateStart', params.initialDate);
  if (params.finalDate) searchParams.append('dateEnd', params.finalDate);
  if (params.status) {
    const status = Array.isArray(params.status) ? params.status.join(',') : params.status;
    searchParams.append('status', status);
  }
  if (params.tipoManutencao) {
    const tipo = Array.isArray(params.tipoManutencao) ? params.tipoManutencao.join(',') : params.tipoManutencao;
    searchParams.append('tipoManutencao', tipo);
  }
  if (params.finishedAt !== undefined) searchParams.append('finishedAt', String(params.finishedAt));
  if (params.osCodeJobId) searchParams.append('osCodeJobId', params.osCodeJobId);
  if (params.equipmentCritical) searchParams.append('equipmentCritical', params.equipmentCritical);

  const url = `/formdata/cmms/${idForm}/activities?${searchParams.toString()}`;
  const response = await api.get<CmmsActivitiesResponse>(url);
  return response.data;
}

// Hooks
export function useFilledForms(params: FilledFormSearch) {
  return useQuery({
    queryKey: filledFormKeys.list(params),
    queryFn: () => fetchFilledForms(params),
    placeholderData: (previousData) => previousData, // Keep data while fetching new page
  });
}

export function useCmmsActivities(idForm: string | undefined, params: FilledFormSearch) {
  return useQuery({
    queryKey: filledFormKeys.activities(idForm || '', params),
    queryFn: () => fetchCmmsActivities(idForm as string, params),
    enabled: !!idForm,
  });
}
