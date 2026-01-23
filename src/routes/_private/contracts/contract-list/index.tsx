import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/contract-list/')({
  beforeLoad: () => {
    throw redirect({
      to: '/register/contracts',
      search: { page: 1, size: 10, search: undefined },
    });
  },
});
