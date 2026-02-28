import { createFileRoute, Outlet } from '@tanstack/react-router';

function PublicLayout() {
  return <Outlet />;
}

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});
