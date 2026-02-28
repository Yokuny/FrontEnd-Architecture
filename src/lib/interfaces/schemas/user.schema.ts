import { z } from 'zod';
import { emailRegExp, passwordRegExp, titleRegex } from '@/lib/helpers/regex.helper';
import { lengthMessage, mailMessage, passRegexMessage } from '@/lib/helpers/zodMessage.helper';

export const emailSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
});

export const signinSchema = z.object({
  email: z.string().trim().email(mailMessage()).min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(emailRegExp),
  password: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
});

export const signupSchema = z.object({
  name: z.string().min(3, lengthMessage(3, 26)).max(26, lengthMessage(3, 26)).regex(titleRegex),
  password: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
});

export const userSchema = z.object({
  name: z.string().min(3, lengthMessage(3, 26)).max(26, lengthMessage(3, 26)).regex(titleRegex),
  password: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
  image: z.string().url().optional(),
});

export const passwordUpdateSchema = z.object({
  oldPassword: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
  newPassword: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
  confirmPassword: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
});

export const passwordResetSchema = z
  .object({
    email: z.string().trim().email(mailMessage()).min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(emailRegExp),
    password: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
    confirmPassword: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(passwordRegExp, passRegexMessage()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export const userInviteSchema = z.object({
  email: z.string().trim().email(mailMessage()).min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)).regex(emailRegExp),
  role: z.enum(['professional', 'assistant', 'guest']),
  rooms: z.array(z.string().min(1)).min(1, 'Selecione pelo menos uma sala'),
});

export const updateRoleAndRoomSchema = z.object({
  permissions: z.array(
    z.object({
      userID: z.string(),
      roles: z.array(z.enum(['admin', 'professional', 'assistant', 'guest'])),
      rooms: z.array(z.string()),
    }),
  ),
});

export type SignIn = z.infer<typeof signinSchema>;
export type SignUp = z.infer<typeof signupSchema>;
export type User = z.infer<typeof userSchema>;
export type PasswordUpdate = z.infer<typeof passwordUpdateSchema>;
export type PasswordReset = z.infer<typeof passwordResetSchema>;
export type UserInvite = z.infer<typeof userInviteSchema>;
export type UpdateRoleAndRoom = z.infer<typeof updateRoleAndRoomSchema>;
