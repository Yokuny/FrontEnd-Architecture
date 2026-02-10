import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface FormField {
  id: number;
  name: string;
  description: string;
  type: string;
  required?: boolean;
  fields?: FormField[];
  options?: string[];
}

export interface FormPermission {
  visibility: 'all' | 'limited' | 'none';
  users?: Array<{ value: string; label: string }>;
}

export interface FormPermissions {
  view?: FormPermission;
  edit?: FormPermission;
  fill?: FormPermission;
  deleteFormBoard?: FormPermission;
  justify?: FormPermission;
  editFilling?: FormPermission;
  block?: FormPermission;
}

export interface FormDetail {
  id: string;
  _id?: string;
  description: string;
  code?: string;
  typeForm?: string;
  fields?: FormField[];
  permissions?: FormPermissions;
  validations?: any[];
  isVisiblePublic?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  users?: string[];
  emails?: string[];
  enterprise?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
  appliedPermissions?: {
    canEdit: boolean;
  };
}

export interface Form {
  id: string;
  _id?: string;
  description: string;
  code?: string;
  typeForm?: string;
  enterprise?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
  appliedPermissions?: {
    canEdit: boolean;
    canFill?: boolean;
  };
}

export interface FormListParams {
  idEnterprise?: string;
  page?: number;
  size?: number;
  description?: string;
}

export interface FormListResponse {
  data: Form[];
  pageInfo?: { count: number };
}

export interface FormSaveData {
  id?: string;
  _id?: string;
  idEnterprise: string;
  description: string;
  fields: FormField[];
  typeForm?: string;
  permissions?: {
    view: { visibility: string; users: string[] };
    edit: { visibility: string; users: string[] };
    fill: { visibility: string; users: string[] };
    deleteFormBoard: { visibility: string; users: string[] };
    justify: { visibility: string; users: string[] };
    editFilling: { visibility: string; users: string[] };
    block: { visibility: string; users: string[] };
  };
  validations?: any[];
  whatsapp?: boolean;
  email?: boolean;
  users?: string[];
  emails?: string[];
}

// Query keys
export const formsKeys = {
  all: ['forms'] as const,
  lists: () => [...formsKeys.all, 'list'] as const,
  list: (idEnterprise?: string) => [...formsKeys.lists(), { idEnterprise }] as const,
  paginated: (params: FormListParams) => [...formsKeys.lists(), 'paginated', params] as const,
  detail: (id: string) => [...formsKeys.all, 'detail', id] as const,
};

// API functions
async function fetchForms(idEnterprise?: string): Promise<Form[]> {
  const url = `/form/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ''}`;
  const response = await api.get<Form[]>(url);
  return response.data;
}

async function fetchFormsPaginated(params: FormListParams): Promise<FormListResponse> {
  const searchParams = new URLSearchParams();

  if (params.idEnterprise) searchParams.append('idEnterprise', params.idEnterprise);
  if (params.page !== undefined) searchParams.append('page', String(params.page));
  if (params.size !== undefined) searchParams.append('size', String(params.size));
  if (params.description) searchParams.append('description', params.description);

  const url = `/form/list?${searchParams.toString()}`;
  const response = await api.get<FormListResponse>(url);
  return response.data;
}

async function fetchForm(id: string): Promise<FormDetail> {
  const response = await api.get<FormDetail>(`/form?id=${id}`);
  return response.data;
}

// Hooks
export function useForms(idEnterprise?: string) {
  return useQuery({
    queryKey: formsKeys.list(idEnterprise),
    queryFn: () => fetchForms(idEnterprise),
  });
}

export function useFormsPaginated(params: FormListParams) {
  return useQuery({
    queryKey: formsKeys.paginated(params),
    queryFn: () => fetchFormsPaginated(params),
    enabled: !!params.idEnterprise,
  });
}

export function useForm(id?: string) {
  return useQuery({
    queryKey: formsKeys.detail(id || ''),
    queryFn: () => (id ? fetchForm(id) : Promise.reject(new Error('No ID provided'))),
    enabled: !!id,
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

// Mutations
export function useFormsApi() {
  const queryClient = useQueryClient();

  const createForm = useMutation({
    mutationFn: (data: FormSaveData) => api.post('/form?isNew=true', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });

  const updateForm = useMutation({
    mutationFn: (data: FormSaveData) => api.put('/form', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: formsKeys.detail(variables.id) });
      }
    },
  });

  const deleteForm = useMutation({
    mutationFn: (id: string) => api.delete(`/form?id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formsKeys.lists() });
    },
  });

  return { createForm, updateForm, deleteForm };
}
