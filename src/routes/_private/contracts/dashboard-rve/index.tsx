import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve/')({
  beforeLoad: () => {
    throw redirect({
      to: '/statistics/rve-dashboard',
    });
  },
});
