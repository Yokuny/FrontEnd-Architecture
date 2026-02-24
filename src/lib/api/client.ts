/**
 * HTTP API Client
 * Fetch configurado para requitar ao backend
 */

import { toast } from 'sonner';

import { useAuth } from '@/hooks/use-auth';

const baseURL = import.meta.env.VITE_URI_BASE || 'http://localhost:3001';
const timeout = parseInt(import.meta.env.VITE_URI_TIMEOUT || '30000', 10);

function clearLocalStorage() {
  useAuth.getState().clearAuth();
}

async function handleError(response: Response, options: ApiOptions) {
  if (options.defaultTakeCareError === false) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  let errorData: { code?: string; message?: string } | null = null;
  try {
    errorData = await response.json();
  } catch {}

  if (response.status === 401) {
    toast.error('session.expired');
    clearLocalStorage();
    window.location.href = `${window.location.origin}/auth`;
  } else if (response.status === 403) {
    if (errorData?.code) {
      toast.warning(errorData.code);
    } else {
      toast.warning('user.notAllowed');
    }
  } else if (response.status === 400) {
    if (errorData?.code) {
      toast.warning(errorData.code);
    } else if (errorData?.message) {
      toast.warning(errorData.message);
    }
  } else if (response.status === 500) {
    if (errorData?.code) {
      toast.error(errorData.code);
    } else {
      toast.error('no.connection');
    }
  } else if (response.status === 429) {
    toast.error('server.too.many.request');
  } else {
    toast.error('no.connection');
  }

  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

async function parseResponse<T>(response: Response, responseType: ApiOptions['responseType']): Promise<T> {
  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || contentType.indexOf('application/json') === -1) {
    if (responseType === 'blob') return (await response.blob()) as T;
    if (responseType === 'text') return (await response.text()) as T;
    if (responseType === 'arraybuffer') return (await response.arrayBuffer()) as T;
    return (await response.text()) as T;
  }

  switch (responseType) {
    case 'blob':
      return (await response.blob()) as T;
    case 'text':
      return (await response.text()) as T;
    case 'arraybuffer':
      return (await response.arrayBuffer()) as T;
    default:
      try {
        return (await response.json()) as T;
      } catch {
        return {} as T;
      }
  }
}

async function fetchWithTimeout<T>(url: string, init: RequestInit, options: ApiOptions): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Note: Native fetch doesn't support upload progress directly
    // This is a limitation compared to Axios
    // For real upload progress, you'd need to use XMLHttpRequest

    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleError(response, options);
    }

    const data = await parseResponse<T>(response, options.responseType);

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      toast.error('Request timeout');
    }
    throw error;
  }
}

function createHeaders(options: ApiOptions): HeadersInit {
  const token = useAuth.getState().token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.method === 'GET' || options.method === 'DELETE') {
    delete headers['Content-Type'];
  }

  if (token) {
    headers.token = token;
  }

  return {
    ...headers,
    ...(options.headers || {}),
  } as HeadersInit;
}

function getBaseURL(options: ApiOptions): string {
  if (options.baseURL) return options.baseURL;
  return options.isV2 ? baseURL.replace('/v1', '/v2') : baseURL;
}

class ApiClient {
  async get<T = unknown>(url: string, options: ApiOptions & { params?: Record<string, any> } = {}) {
    const urlNormalized = url.split('?')[0];
    const existingParams = url.split('?')[1];

    const query = new URLSearchParams(existingParams);

    if (options.params) {
      Object.keys(options.params).forEach((key) => {
        const value = (options.params as any)[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              query.append(key, String(v));
            });
          } else {
            query.append(key, String(value));
          }
        }
      });
    }

    const queryString = query.toString();
    const fullUrl = `${getBaseURL(options)}${urlNormalized}${queryString ? `?${queryString}` : ''}`;

    return fetchWithTimeout<T>(
      fullUrl,
      {
        method: 'GET',
        headers: createHeaders({ ...options, method: 'GET' }),
      },
      options,
    );
  }

  async post<T = unknown>(url: string, data?: unknown, options: ApiOptions = {}) {
    const fullUrl = `${getBaseURL(options)}${url}`;
    const headers = createHeaders(options);

    // Handle FormData (don't set Content-Type, let browser set it with boundary)
    const isFormData = data instanceof FormData;
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }

    return fetchWithTimeout<T>(
      fullUrl,
      {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      },
      options,
    );
  }

  async put<T = unknown>(url: string, data?: unknown, options: ApiOptions = {}) {
    const fullUrl = `${getBaseURL(options)}${url}`;
    const headers = createHeaders(options);

    const isFormData = data instanceof FormData;
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }

    return fetchWithTimeout<T>(
      fullUrl,
      {
        method: 'PUT',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      },
      options,
    );
  }

  async patch<T = unknown>(url: string, data?: unknown, options: ApiOptions = {}) {
    const fullUrl = `${getBaseURL(options)}${url}`;
    const headers = createHeaders(options);

    const isFormData = data instanceof FormData;
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }

    return fetchWithTimeout<T>(
      fullUrl,
      {
        method: 'PATCH',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      },
      options,
    );
  }

  async delete<T = unknown>(url: string, options: ApiOptions & { params?: Record<string, any> } = {}) {
    const urlNormalized = url.split('?')[0];
    const existingParams = url.split('?')[1];

    const query = new URLSearchParams(existingParams);

    if (options.params) {
      Object.keys(options.params).forEach((key) => {
        const value = (options.params as any)[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => {
              query.append(key, String(v));
            });
          } else {
            query.append(key, String(value));
          }
        }
      });
    }

    const queryString = query.toString();
    const fullUrl = `${getBaseURL(options)}${urlNormalized}${queryString ? `?${queryString}` : ''}`;

    return fetchWithTimeout<T>(
      fullUrl,
      {
        method: 'DELETE',
        headers: createHeaders({ ...options, method: 'DELETE' }),
      },
      options,
    );
  }
}

export const api = new ApiClient();
export default api;

interface ApiOptions {
  defaultTakeCareError?: boolean;
  handleUploadProgress?: (percent: number) => void;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
  isV2?: boolean;
  method?: string;
  baseURL?: string;
}

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
