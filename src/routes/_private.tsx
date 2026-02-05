import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

// import { useInitPermissions } from '@/hooks/use-permissions';

/**
 * Criando Rotas Privadas
 * Layout route para rotas privadas (com autenticação)
 * Redireciona para /auth se não estiver autenticado
 */

function PrivateLayout() {
  // Initialize permissions on app load (handles refresh/rehydration)
  // TOOD: useInitPermissions();

  return (
    <SidebarProvider defaultOpen={false}>
      <main className="relative flex w-full bg-accent">
        <AppSidebar />
        {/* representa a Main */}
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
