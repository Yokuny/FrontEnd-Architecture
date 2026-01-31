import { z } from 'zod';

export const fasOrderFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Field required'),
  job: z.string().optional().nullable(),
  jobRequired: z.boolean(),
  description: z.string().min(1, 'Field required'),
  materialFas: z.string().min(1, 'Field required'),
  materialFasCode: z.string().optional().nullable(),
  onboardMaterial: z.string().min(1, 'Field required'),
  rmrb: z.string().min(1, 'Field required'),
  rmrbCode: z.string().optional().nullable(),
  files: z.array(z.any()).default([]).optional(),
  supplierCanView: z.boolean().default(true).optional(),
  rating: z.string().optional().nullable(),
  ratingDescription: z.string().optional().nullable(),
  questions: z
    .record(z.object({ value: z.string() }))
    .optional()
    .nullable(),
  partial: z.string().default('complete.execution').optional(),
  supplierData: z.any().optional().nullable(),
  requestOrder: z.string().optional().nullable(),
  vor: z.string().optional().nullable(),
});

export const fasFormSchema = z
  .object({
    idEnterprise: z.string().min(1, 'Enterprise required'),
    idVessel: z.string().min(1, 'Vessel required'),
    type: z.string().min(1, 'Type required'),
    serviceDate: z.string().min(1, 'Date required'),
    teamChange: z.boolean(),
    local: z.string().min(1, 'Local required'),
    orders: z.array(fasOrderFormSchema).min(1, 'At least one service is required'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Normal') {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 6);
      const selectedDate = new Date(data.serviceDate);

      // Note: Legacy compares full date object.
      // If selectedDate < minDate
      if (selectedDate < minDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'fas.service.date.min.days.required',
          path: ['serviceDate'],
        });
      }
    }
  });

export type FasOrderFormValues = z.infer<typeof fasOrderFormSchema>;
export type FasFormValues = z.infer<typeof fasFormSchema>;
