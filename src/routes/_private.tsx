import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar-03/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

/**
 * Criando Rotas Privadas
 * Layout route para rotas privadas (com autenticação)
 * Redireciona para /auth se não estiver autenticado
 *
 * Rotas que não devem ter sidebar por padrão (fullscreen):
 * - /fleet
 *
 * Para essas rotas, a sidebar pode ser aberta via toggle.
 */

// Lista de rotas que devem ter layout fullscreen (sem sidebar visível por padrão)
const FULLSCREEN_ROUTES = ['/fleet'];

function PrivateLayout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isFullscreenRoute = FULLSCREEN_ROUTES.some((route) => currentPath.startsWith(route));

  return (
    <SidebarProvider defaultOpen={!isFullscreenRoute}>
      <div className="relative flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <main className="md:p-2.5 md:pl-1">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
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
