import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface PartEnterprise {
  id: string;
  name: string;
}

export interface PartImage {
  id: string;
  url: string;
  name: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  description?: string;
  idEnterprise?: string;
  enterprise?: PartEnterprise;
  image?: PartImage;
}

export interface PartListResponse {
  data: Part[];
  pageInfo?: Array<{ count: number }>;
}

export interface PartFormInput {
  id?: string;
  name: string;
  sku: string;
  description: string;
  idEnterprise: string;
}

// Query keys
export const partsKeys = {
  all: ['parts'] as const,
  lists: () => [...partsKeys.all, 'list'] as const,
  list: (params: { idEnterprise?: string; page?: number; size?: number; search?: string }) => [...partsKeys.lists(), params] as const,
  details: () => [...partsKeys.all, 'detail'] as const,
  detail: (id?: string) => [...partsKeys.details(), id] as const,
  byEnterprise: (id: string) => [...partsKeys.all, 'enterprise', id] as const,
};

// API functions

/**
 * List parts with pagination
 * Legacy: GET /part/list
 */
async function fetchPartsList(params: { idEnterprise?: string; page?: number; size?: number; search?: string }): Promise<PartListResponse> {
  const queryParams = new URLSearchParams();
  if (params.idEnterprise) queryParams.append('idEnterprise', params.idEnterprise);
  if (params.page !== undefined) queryParams.append('page', String(params.page));
  if (params.size !== undefined) queryParams.append('size', String(params.size));
  if (params.search) queryParams.append('search', params.search);

  const response = await api.get<PartListResponse>(`/part/list?${queryParams.toString()}`);
  return response.data;
}

/**
 * List all parts for an enterprise (for select components)
 */
async function fetchPartsByEnterprise(idEnterprise: string): Promise<Part[]> {
  const response = await api.get<Part[]>(`/part?idEnterprise=${idEnterprise}`);
  return response.data;
}

/**
 * Find part by ID
 * Legacy: GET /part/find?id=${id}
 */
async function fetchPartById(id: string): Promise<Part> {
  const response = await api.get<Part>(`/part/find?id=${id}`);
  return response.data;
}

/**
 * Create or update part
 * Legacy: POST /part
 */
async function savePart(data: PartFormInput): Promise<Part> {
  const response = await api.post<Part>('/part', data);
  return response.data;
}

/**
 * Upload part image
 * Legacy: POST /file/upload/part?id=${idPart}&directory=part
 */
async function uploadPartImage({ id, file }: { id: string; file: File }): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await api.post(`/file/upload/part?id=${id}&directory=part`, formData);
}

// Hooks

/**
 * Hook for fetching paginated parts list
 */
export function useParts(params: { idEnterprise?: string; page?: number; size?: number; search?: string }) {
  return useQuery({
    queryKey: partsKeys.list(params),
    queryFn: () => fetchPartsList(params),
    enabled: !!params.idEnterprise,
  });
}

/**
 * Hook for fetching a single part by ID
 */
export function usePart(id: string | undefined) {
  return useQuery({
    queryKey: partsKeys.detail(id),
    queryFn: () => {
      if (!id) return Promise.resolve(undefined);
      return fetchPartById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook for parts mutations (save, upload image)
 */
export function usePartsApi() {
  const queryClient = useQueryClient();

  const savePartMutation = useMutation({
    mutationFn: savePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partsKeys.lists() });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadPartImage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: partsKeys.detail(variables.id) });
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/part?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partsKeys.all });
    },
  });

  return {
    savePart: savePartMutation,
    uploadImage: uploadImageMutation,
    deletePart: deletePartMutation,
  };
}

/**
 * Hook for fetching parts for select components
 */
export function usePartsByEnterpriseSelect(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: partsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => {
      if (!idEnterprise) return Promise.resolve([]);
      return fetchPartsByEnterprise(idEnterprise);
    },
    enabled: !!idEnterprise,
  });
}

// Helper hook for compatibility with existing selects
export function usePartsSelect(idEnterprise: string | undefined) {
  return usePartsByEnterpriseSelect(idEnterprise);
}

// Helper function to map parts to select options
export function mapPartsToOptions(parts: Part[]) {
  return parts.map((part) => ({
    value: part.id,
    label: `${part.name} (${part.sku})`,
    data: part,
  }));
}
