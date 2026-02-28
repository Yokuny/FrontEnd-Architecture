import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import { useAuthStore } from '@/hooks/auth';
import { api } from '@/lib/api/client';
import type { signinSchema, signupSchema } from '@/lib/interfaces/schemas/user.schema';

export function useAuthApi() {
  const { setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (values: z.infer<typeof signinSchema>) => {
      const res = await api.post('/auth/signin', values);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || 'Falha na autenticação');
      }

      const { accessToken, userId, user } = data.data;
      setAuth(accessToken, userId, user);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const signup = useMutation({
    mutationFn: async (values: z.infer<typeof signupSchema>) => {
      const res = await api.post('/auth/signup', values);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || 'Falha no cadastro');
      }

      return data.data;
    },
  });

  const validateEmail = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await api.post('/auth/validate-email', { email });
      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || 'Houve um erro na validação do E-mail');
      }

      return data;
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await api.post('/user/forgot-password', { email });
      const data = res.data;
      if (!data.success) throw new Error(data.message || 'Erro ao enviar e-mail de recuperação');
      return data;
    },
  });

  const completeSignup = useMutation({
    mutationFn: async ({ id, name, email, password }: { id: string; name: string; email: string; password: string }) => {
      const res = await api.put(`/auth/signup/${id}`, { name, email, password });
      const data = res.data;
      if (!data.success) throw new Error(data.message || 'Falha ao completar cadastro');
      return data;
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ id, email, password, confirmPassword }: { id: string; email: string; password: string; confirmPassword: string }) => {
      const res = await api.put(`/user/reset-password/${id}`, { email, password, confirmPassword });
      const data = res.data;
      if (!data.success) throw new Error(data.message || 'Erro ao redefinir senha');
      return data;
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
  };

  return { login, signup, validateEmail, logout, forgotPassword, completeSignup, resetPassword };
}
