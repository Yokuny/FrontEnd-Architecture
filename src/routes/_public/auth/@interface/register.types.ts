import { z } from "zod";

// ============================================================================
// Schemas
// ============================================================================

export const registerSearchSchema = z.object({
  id: z.string().optional(), // Enterprise ID
  enterprise: z.string().optional(), // Enterprise name
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
    reCaptcha: z.string().min(1, "Please complete the reCAPTCHA"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ============================================================================
// Types
// ============================================================================

export type RegisterFormValues = z.infer<typeof registerSchema>;
