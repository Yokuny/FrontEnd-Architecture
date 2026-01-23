import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve-rdo/')({
  beforeLoad: () => {
    throw redirect({
      to: '/consumption/rve-rdo',
    });
  },
});
