import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

/**
 * Layout route para rotas privadas (com autenticacao)
 * Redireciona para /auth se nao estiver autenticado
 */

function PrivateLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <main className="relative flex w-full bg-accent">
        <AppSidebar />
        <SidebarInset>
          <div className="md:p-2.5 md:pl-1">
            <Outlet />
          </div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}

export const Route = createFileRoute('/_private')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuth.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: PrivateLayout,
});
