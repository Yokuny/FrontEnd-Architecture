import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-sso/')({
  component: () => <div>Setup SSO</div>,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
});
