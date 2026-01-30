import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/cmms/diagram-list/')({
  beforeLoad: () => {
    throw redirect({
      to: '/telemetry/diagram-list',
      search: {
        page: 0,
        search: undefined,
      },
    });
  },
});
