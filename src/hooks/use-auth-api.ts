/**
 * TanStack Query hooks for authentication API operations
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { useAuth } from './use-auth';

// ============================================================================
// Types
// ============================================================================

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

interface ValidationResponse {
  success: boolean;
  message?: string;
}

// ============================================================================
// Auth API Hooks
// ============================================================================

export const authKeys = {
  all: ['auth'] as const,
  validation: () => [...authKeys.all, 'validation'] as const,
};

export function useAuthApi() {
  const { setAuth, clearAuth } = useAuth();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post<LoginResponse>('/auth/signin', { email, password });
      if (!response.data.success) throw new Error(response.data.message || 'Falha ao autenticar');
      return response.data;
    },
    onSuccess: (data) => {
      const { accessToken } = data.data || {};
      if (accessToken) {
        setAuth(accessToken);
        const professionalColors = localStorage.getItem('professional-colors');
        localStorage.clear(); // Preserve specific items
        if (professionalColors) {
          localStorage.setItem('professional-colors', professionalColors);
        }
        navigate({ to: '/app' });
      }
    },
  });

  const validateEmail = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await api.post<ValidationResponse>('/auth/email-validation', { email });
      if (!response.data.success) throw new Error(response.data.message || 'Erro ao validar e-mail');
      return response.data;
    },
  });

  const useCheckAuthentication = () => {
    return useQuery({
      queryKey: authKeys.validation(),
      queryFn: async () => {
        try {
          const response = await api.get<ValidationResponse>('/auth/validate');
          if (!response.data?.success) {
            clearAuth(); // Token is invalid
            return false;
          }
          return true;
        } catch {
          clearAuth();
          return false;
        }
      },
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  const logout = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', {});
    },
    onSettled: () => {
      clearAuth();
      const professionalColors = localStorage.getItem('professional-colors');
      localStorage.clear();
      if (professionalColors) {
        localStorage.setItem('professional-colors', professionalColors);
      }
      navigate({ to: '/auth' });
    },
  });

  return {
    login,
    validateEmail,
    logout,
    useCheckAuthentication,
  };
}
