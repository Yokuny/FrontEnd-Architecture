import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(150),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  idEnterprise: z.string().min(1, 'Enterprise is required'),
  language: z.string().nullable().optional().or(z.literal('')),
  isUser: z.boolean().default(true),
  isOnlyContact: z.boolean().default(false),
  isSentMessageWelcome: z.boolean().default(true),
  isUserCustomer: z.boolean().default(false),
  roles: z.array(z.string()).default([]),
  types: z.array(z.string()).default([]),
  customers: z.array(z.string()).default([]),
  typeCredentials: z.array(z.string()).default([]),
  disabledAt: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserFormData = Omit<User, 'id'>;

// User list item
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: { url: string };
  isOnlyContact: boolean;
  disabledAt?: string;
  types?: UserType[];
  userEnterprise?: UserEnterprise[];
}

// User type
export interface UserType {
  id: string;
  description: string;
  color?: string;
}

// User enterprise
export interface UserEnterprise {
  id: string;
  enterprise: {
    id: string;
    name: string;
  };
  role?: Role[];
}

// Role
export interface Role {
  id: string;
  description: string;
}

// User permission schema
export const userPermissionSchema = z.object({
  id: z.string().optional(),
  idUser: z.string().min(1, 'User is required'),
  idEnterprise: z.string().min(1, 'Enterprise is required'),
  roles: z.array(z.string()).default([]),
  isUserCustomer: z.boolean().default(false),
  customers: z.array(z.string()).default([]),
});

export type UserPermission = z.infer<typeof userPermissionSchema>;

// Password update schema
export const passwordUpdateSchema = z.object({
  idUser: z.string().min(1, 'User is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;

// Filter data
export interface UserFilterData {
  filteredRole: string[];
  filteredType: string[];
}

// Search Params for permissions
export const userPermissionSearchSchema = z.object({
  id: z.string().optional(),
  idRef: z.string().optional(),
});

export type UserPermissionSearch = z.infer<typeof userPermissionSearchSchema>;
