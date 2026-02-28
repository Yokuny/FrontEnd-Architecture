import { z } from 'zod';
import { validObjectID } from '@/lib/helpers/validade.helper';
import { objectIdMessage } from '@/lib/helpers/zodMessage.helper';

export const idSchema = z.object({
  id: z.string().refine(validObjectID, objectIdMessage()),
});

export const idSchemaOptional = z.object({
  id: z.string().refine(validObjectID, objectIdMessage()).optional(),
});
