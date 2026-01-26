import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/cmms/kpis-cmms/')({
  beforeLoad: () => {
    throw redirect({
      to: '/statistics/kpis-cmms',
    });
  },
});
