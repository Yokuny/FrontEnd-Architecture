import { createFileRoute, Outlet } from '@tanstack/react-router';

function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-6 md:px-6">
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});
