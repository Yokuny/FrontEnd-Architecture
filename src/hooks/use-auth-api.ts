/**
 * TanStack Query hooks for authentication API operations
 */

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { useAuth } from './use-auth';

// ============================================================================
// Types
// ============================================================================

interface LoginResponse {
  token: string;
}

// ============================================================================
// Login Hook
// ============================================================================

export function useLogin() {
  const { setAuth, setLoading } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      const response = await api.post<LoginResponse>('/auth/login', {
        email: email.trim(),
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);

      if (data?.token) {
        setAuth(data.token);
        toast.success('Login successful!');
        navigate({ to: '/' });
      }
    },
    onError: () => {
      setLoading(false);
    },
  });
}
