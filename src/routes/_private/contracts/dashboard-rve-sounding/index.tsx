import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve-sounding/')({
  beforeLoad: () => {
    throw redirect({
      to: '/consumption/rve-sounding',
    });
  },
});
