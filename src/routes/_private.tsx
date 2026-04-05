import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { MobileDock } from '@/components/mobile-dock';
import { AppSidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStore } from '@/hooks/auth';

function PrivateLayout() {
  return (
    <main className="bg-accent md:p-2 md:pl-1">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <MobileDock />
    </main>
  );
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
