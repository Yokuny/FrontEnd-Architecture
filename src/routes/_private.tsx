import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppSidebar } from '@/components/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStore } from '@/hooks/auth';

function PrivateLayout() {
  return (
    <main className="bg-muted p-1 pt-2.25 md:pr-4">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset className="flex flex-col pb-20 md:gap-3 md:pb-24">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
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
