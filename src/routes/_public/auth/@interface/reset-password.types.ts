import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

export const resetSearchSchema = z.object({
  request: z.string().optional(), // Reset request ID from email link
});

export const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
  reCaptcha: z.string().min(1, 'Please complete the reCAPTCHA'),
});

export const resetPasswordSchema = z
  .object({
    code: z.string().min(6, 'Code must be at least 6 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[*,@,#,!,?,_,\-,=,+,$]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ============================================================================
// Types
// ============================================================================

export type RequestResetFormValues = z.infer<typeof requestResetSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type ResetStep = 'request' | 'reset' | 'success';

export interface PasswordStrength {
  minLength: boolean;
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasSpecialChar: boolean;
}
