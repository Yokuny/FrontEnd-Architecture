import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { toast } from 'sonner';
import { useAppAuth } from '@/hooks/use-app-auth';
import { api } from '@/lib/api/client';
import type { AppLoginResponse } from '../@interface/app-auth.interface';

export function useAppLogin() {
  const { setAuth } = useAppAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ cpf, password }: { cpf: string; password: string }) => {
      const response = await api.post<AppLoginResponse>('/api/app/login', {
        cpf: cpf.replace(/\D/g, ''),
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.data) {
        setAuth(data.data.token, data.data.id, '');
        toast.success('login.success');
        navigate({ to: '/access-user' });
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.originalError?.message || err?.response?.data?.message || 'appAuth.login.error';
      toast.error(msg);
    },
  });
}

export function useGuestByCpf() {
  return useMutation({
    mutationFn: async (cpf: string) => {
      const response = await api.get<{ data: any; statusCode: number }>('/app/guests/search/cpf', {
        params: { cpf },
      });
      return response.data.data;
    },
  });
}

export function useUpdateGuestImage() {
  return useMutation({
    mutationFn: async ({ id, url_image }: { id: string; url_image: string[] }) => {
      const response = await api.put<{ data: any; statusCode: number }>(`/app/guests/${id}/image`, {
        url_image,
      });
      return response.data.data;
    },
  });
}
