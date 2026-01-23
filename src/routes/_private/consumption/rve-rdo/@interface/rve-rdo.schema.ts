import { z } from 'zod';

export const searchSchema = z.object({
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  machines: z.string().optional(),
  showInoperabilities: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      return val === 'true';
    }),
});

export type RVERDOSearch = z.infer<typeof searchSchema>;
