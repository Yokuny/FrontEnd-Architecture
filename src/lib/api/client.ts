import { useAuthStore } from '@/hooks/auth';

const API = () => {
  const url = import.meta.env.VITE_CORE_URL || '';
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type headersStructure = {
  method: Method;
  headers: {
    'Content-Type': string;
    authorization?: string;
    [key: string]: string | undefined;
  };
  body?: string;
  withCredentials: boolean;
};

type Response<T> = {
  success: boolean;
  data: T;
  message: string;
};

const FetchConfig = (body: object, method: Method) => {
  const headers: headersStructure = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    body: JSON.stringify(body),
  };
  // Token lido do Zustand store via .getState() — funciona fora de componentes React.
  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.headers.authorization = `Ease ${token}`;
  }

  if (method === 'GET' || method === 'DELETE') delete headers.body;

  return headers;
};

const POST = (body: object) => FetchConfig(body, 'POST');
const PUT = (body: object) => FetchConfig(body, 'PUT');
const PATCH = (body: object) => FetchConfig(body, 'PATCH');
const GET = () => FetchConfig({}, 'GET');
const DELETE = () => FetchConfig({}, 'DELETE');

const request = async (path: string, config: headersStructure) => {
  const url = new URL(`${API()}${path.startsWith('/') ? path : `/${path}`}`);

  const res = await fetch(url.toString(), {
    method: config.method,
    headers: config.headers as any,
    body: config.body,
    credentials: 'include',
  });

  return (await res.json()) as Response<any>;
};

const requestWithoutToken = async (path: string) => {
  const res = await fetch(`${API()}${path.startsWith('/') ? path : `/${path}`}`, { method: 'GET' });
  return res.json() as Promise<Response<any>>;
};

// API Object for compatibility with other files (Axios-like)
const api = {
  get: async <T = any>(path: string, config?: { headers?: any; params?: any }) => {
    let urlPath = path;
    if (config?.params) {
      const params = new URLSearchParams(config.params);
      urlPath += `?${params.toString()}`;
    }
    const headers = GET();
    if (config?.headers) {
      headers.headers = { ...headers.headers, ...config.headers };
    }
    const res = await request(urlPath, headers);
    return { data: res } as { data: T }; // Wrap as Axios response { data }
  },
  post: async <T = any>(path: string, body?: any, config?: { headers?: any }) => {
    const headers = POST(body || {});
    if (config?.headers) {
      headers.headers = { ...headers.headers, ...config.headers };
    }
    const res = await request(path, headers);
    return { data: res } as { data: T };
  },
  put: async <T = any>(path: string, body?: any, config?: { headers?: any }) => {
    const headers = PUT(body || {});
    if (config?.headers) {
      headers.headers = { ...headers.headers, ...config.headers };
    }
    const res = await request(path, headers);
    return { data: res } as { data: T };
  },
  patch: async <T = any>(path: string, body?: any, config?: { headers?: any }) => {
    const headers = PATCH(body || {});
    if (config?.headers) {
      headers.headers = { ...headers.headers, ...config.headers };
    }
    const res = await request(path, headers);
    return { data: res } as { data: T };
  },
  delete: async <T = any>(path: string, config?: { headers?: any }) => {
    const headers = DELETE();
    if (config?.headers) {
      headers.headers = { ...headers.headers, ...config.headers };
    }
    const res = await request(path, headers);
    return { data: res } as { data: T };
  },
};

export { api, DELETE, GET, PATCH, POST, PUT, request, requestWithoutToken };
