// import { createFileRoute, Outlet, redirect, useRouterState } from '@tanstack/react-router';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
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
// const FULLSCREEN_ROUTES = ['/fleet'];

function PrivateLayout() {
  // const router = useRouterState();
  // const currentPath = router.location.pathname;

  // const isFullscreenRoute = FULLSCREEN_ROUTES.some((route) => currentPath.startsWith(route));

  return (
    <SidebarProvider defaultOpen={false}>
      <main className="relative flex bg-accent w-full">
        {/* <AppSidebar hidden={isFullscreenRoute} /> */}
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
