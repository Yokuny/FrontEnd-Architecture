import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/hooks/auth';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    throw redirect({
      to: isAuthenticated ? '/' : '/',
    });
  },
  component: () => null,
});
