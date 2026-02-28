import { z } from 'zod';
import { numClean } from '@/lib/helpers/formatter.helper';
import { passwordRegExp } from '@/lib/helpers/regex.helper';
import { lengthMessage, mailMessage, passRegexMessage } from '@/lib/helpers/zodMessage.helper';

const roomSchema = z.object({
  _id: z.string().optional(),
  name: z.string().trim().min(1, lengthMessage(1, 26)).max(26, lengthMessage(1, 26)),
});

export const clinicSchema = z
  .object({
    name: z.string().trim().min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)),
    email: z.string().trim().email(mailMessage()).min(5, lengthMessage(5, 50)).max(50, lengthMessage(5, 50)),
    code: z.string().trim().min(6, lengthMessage(6, 10)).max(10, lengthMessage(6, 10)).regex(passwordRegExp, passRegexMessage()),
    cnpj: z
      .string()
      .trim()
      .refine((value) => value === '' || value.length >= 14, lengthMessage(14, 18))
      .refine((value) => value === '' || value.length <= 18, lengthMessage(14, 18))
      .transform(numClean)
      .optional(),
    rooms: z.array(roomSchema).min(1, 'Adicione pelo menos uma sala'),
  })
  .required();

export type NewClinic = z.infer<typeof clinicSchema>;
