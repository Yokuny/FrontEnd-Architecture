import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { z } from 'zod';
import { useAppAuth } from '@/hooks/use-app-auth';
import { api } from '@/lib/api/client';
import type { signinSchema, signupSchema } from '@/lib/interfaces/schemas/user.schema';

export function useAuthApi() {
  const { setAuth, clearAuth } = useAppAuth();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (values: z.infer<typeof signinSchema>) => {
      const response = await api.post('/auth/signin', values);
      const data = response.data;

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
      const response = await api.post('/auth/signup', values);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Falha no cadastro');
      }

      return data.data;
    },
  });

  const validateEmail = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.post('/auth/validate-email', { email });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || 'Houve um erro na validação do E-mail');
      }

      return data;
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
  };

  return { login, signup, validateEmail, logout };
}
