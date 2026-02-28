import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/hooks/auth';

/**
 * Layout route para rotas privadas (com autenticação)
 * Redireciona para /app-auth se não estiver autenticado
 */

function PrivateLayout() {
  return <Outlet />;
}

export const Route = createFileRoute('/_private')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: PrivateLayout,
});
