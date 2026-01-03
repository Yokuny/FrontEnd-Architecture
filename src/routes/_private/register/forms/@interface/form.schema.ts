import { z } from 'zod';

// Field Schema
export const formFieldSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string().optional(), // Used as unique identifier/ID in legacy
    description: z.string().optional(), // Label
    type: z.string().optional(), // Maps to datatype in legacy
    datatype: z.string().optional(),
    size: z.string().optional(),
    isRequired: z.boolean().optional(),
    isShowInList: z.boolean().optional(),
    isVisiblePublic: z.boolean().optional().default(true),
    usersVisible: z.array(z.string()).optional().default([]),
    idModel: z.array(z.string()).optional(), // For selectMachine
    sum: z.boolean().optional(), // For number in tables
    options: z.array(z.string()).optional(),
    fields: z.array(formFieldSchema).optional(),
    isVisible: z.boolean().optional().default(true), // Visibility in public preview
  }),
);

// Main Form Schema
export const formSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  idEnterprise: z.string().min(1, 'enterprise.required'),
  description: z.string().min(1, 'description.required'),
  typeForm: z.string().optional().nullable(),
  fields: z.array(formFieldSchema).default([]),

  // Permissions
  viewVisibility: z.enum(['all', 'limited', 'none']).default('all'),
  viewUsers: z.array(z.string()).optional().default([]),
  editVisibility: z.enum(['all', 'limited', 'none']).default('all'),
  editUsers: z.array(z.string()).optional().default([]),
  fillVisibility: z.enum(['all', 'limited', 'none']).default('all'),
  fillUsers: z.array(z.string()).optional().default([]),
  deleteFormBoardVisibility: z.enum(['all', 'limited', 'none']).default('all'),
  deleteFormBoardUsers: z.array(z.string()).optional().default([]),
  justifyVisibility: z.enum(['all', 'limited', 'none']).optional().default('all'),
  justifyUsers: z.array(z.string()).optional().default([]),
  editFormFillingVisibility: z.enum(['all', 'limited', 'none']).optional().default('all'),
  editFormFillingUsers: z.array(z.string()).optional().default([]),
  blockVisibility: z.enum(['all', 'limited', 'none']).optional().default('all'),
  blockUsers: z.array(z.string()).optional().default([]),

  // Notifications
  whatsapp: z.boolean().optional().default(false),
  users: z.array(z.string()).optional().default([]),
  email: z.boolean().optional().default(false),
  emails: z.array(z.string()).optional().default([]),

  // Validations
  validations: z.array(z.any()).optional().default([]),
});

export type FormFormData = z.infer<typeof formSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
