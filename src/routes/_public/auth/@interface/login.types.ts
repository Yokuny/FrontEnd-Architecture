import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

// ============================================================================
// Types
// ============================================================================

export type EmailFormValues = z.infer<typeof emailSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export type LoginStep = 'email' | 'recaptcha' | 'options';

export interface LoginOption {
  isPassword?: boolean;
  isSso?: boolean;
  token?: string;
}
