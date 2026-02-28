import { z } from 'zod';
import { validObjectID } from '@/lib/helpers/validade.helper';
import { objectIdMessage } from '@/lib/helpers/zodMessage.helper';
import { procedureSchema } from './financial.schema';

const optionalProcedureSchema = procedureSchema.optional();

export const odontogramSchema = z
  .object({
    Patient: z.string().refine(validObjectID, objectIdMessage()),
    Professional: z.string().refine(validObjectID, objectIdMessage()),
    finished: z.literal(false),
    teeth: z.array(
      z.object({
        number: z.number().max(99),
        faces: z.object({
          facial: optionalProcedureSchema,
          incisal: optionalProcedureSchema,
          lingual: optionalProcedureSchema,
          mesial: optionalProcedureSchema,
          distal: optionalProcedureSchema,
          occlusal: optionalProcedureSchema,
          palatal: optionalProcedureSchema,
        }),
      }),
    ),
  })
  .required();

export type NewOdontogram = z.infer<typeof odontogramSchema>;
