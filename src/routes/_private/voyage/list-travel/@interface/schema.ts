import { z } from 'zod';

export const voyageLoadSchema = z.object({
  description: z.string().optional(),
  amount: z.string().optional(),
  unit: z.string().optional(),
});

export const voyageLocationSchema = z.object({
  where: z.string().optional(),
  eta: z.date().optional().nullable(),
  ata: z.date().optional().nullable(),
  etb: z.date().optional().nullable(),
  atb: z.date().optional().nullable(),
  etc: z.date().optional().nullable(),
  atc: z.date().optional().nullable(),
  etd: z.date().optional().nullable(),
  atd: z.date().optional().nullable(),
  ets: z.date().optional().nullable(),
  ats: z.date().optional().nullable(),
});

export const voyageItinerarySchema = z
  .object({
    idFence: z.string().optional(),
    where: z.string().optional(),
    load: z.array(voyageLoadSchema).optional(),
    listObservations: z
      .array(
        z.object({
          observation: z.string().optional(),
          value: z.union([z.number(), z.string()]).nullable().optional(),
          showBot: z.boolean().optional(),
        }),
      )
      .optional(),
    eta: z.date().optional().nullable(),
    ata: z.date().optional().nullable(),
    etb: z.date().optional().nullable(),
    atb: z.date().optional().nullable(),
    etc: z.date().optional().nullable(),
    atc: z.date().optional().nullable(),
    etd: z.date().optional().nullable(),
    atd: z.date().optional().nullable(),
    ets: z.date().optional().nullable(),
    ats: z.date().optional().nullable(),
  })
  .passthrough();

export const voyageEventSchema = z
  .object({
    id: z.string().optional(),
    datetime: z.union([z.date(), z.string()]).optional().nullable(),
    status: z.string().optional(),
    stock: z
      .object({
        oil: z
          .object({
            value: z.union([z.number(), z.string()]).optional(),
            unit: z.string().optional(),
          })
          .optional(),
        water: z
          .object({
            value: z.union([z.number(), z.string()]).optional(),
            unit: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    speed: z.union([z.number(), z.string()]).optional(),
    engine: z
      .object({
        rpmBB: z.union([z.number(), z.string()]).optional(),
        rpmBE: z.union([z.number(), z.string()]).optional(),
      })
      .optional(),
    observation: z.string().optional(),
  })
  .passthrough();

export const voyageFormSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'required'),
  asset: z
    .object({
      value: z.string(),
      label: z.string().optional(),
    })
    .nullable()
    .refine((val) => val !== null, { message: 'required' }),

  customer: z
    .object({
      value: z.string(),
      label: z.string().optional(),
    })
    .nullable()
    .optional(),

  from: voyageLocationSchema.optional(),
  to: voyageLocationSchema.optional(),

  load: z.array(voyageLoadSchema).optional(),
  compositionAsset: z.array(z.string()).optional(),
  crew: z.array(z.string()).optional(),

  activity: z.string().optional(),
  goal: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .optional(),

  observation: z.string().optional(),

  itinerary: z.array(voyageItinerarySchema).optional(),
  events: z.array(voyageEventSchema).optional(),

  status: z.string().optional(),

  travelType: z.string().optional(),
});

export type VoyageFormValues = z.input<typeof voyageFormSchema>;
