import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

export const unlockSearchSchema = z.object({
  r: z.string().optional(), // Request ID from blocked login attempt
});

export const unlockMethodSchema = z.object({
  method: z.enum(['email', 'sms']),
});

export const unlockCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters').max(10),
});

// ============================================================================
// Types
// ============================================================================

export type UnlockMethodFormValues = z.infer<typeof unlockMethodSchema>;
export type UnlockCodeFormValues = z.infer<typeof unlockCodeSchema>;

export type UnlockStep = 'select-method' | 'verify-code' | 'success';

export interface UnlockOption {
  type: 'email' | 'sms';
  destination: string; // Masked email or phone
}
