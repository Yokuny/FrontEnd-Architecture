import { z } from 'zod';
import { numClean } from '@/lib/helpers/formatter.helper';
import { birthRegExp } from '@/lib/helpers/regex.helper';
import { lengthMessage, mailMessage } from '@/lib/helpers/zodMessage.helper';

export const patientSchema = z.object({
  name: z.string().trim().min(5, lengthMessage(5, 60)).max(60, lengthMessage(5, 60)),
  email: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, mailMessage())
    .refine((val) => !val || (val.length >= 5 && val.length <= 50), lengthMessage(5, 50)),
  cpf: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .transform((val) => {
      if (val) {
        const cleanedCpf = val.replace(/\D/g, '');
        return cleanedCpf.length > 0 ? cleanedCpf : undefined;
      }
      return val;
    })
    .refine((val) => !val || val.length === 11, lengthMessage(11, 11))
    .transform((val) => (val ? numClean(val) : undefined)),
  rg: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .transform((val) => {
      if (val) {
        const cleanedRg = val.replace(/\D/g, '');
        return cleanedRg.length > 0 ? cleanedRg : undefined;
      }
      return val;
    })
    .refine((val) => !val || (val.length >= 7 && val.length <= 9), 'RG deve ter entre 7 e 9 dígitos'),
  birthdate: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .transform((val) => {
      if (val?.includes('/')) {
        const [day, month, year] = val.split('/');
        if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      return val;
    })
    .refine((val) => !val || birthRegExp.test(val), { message: 'Data de nascimento inválida' }),
  sex: z.enum(['M', 'F']),
  phone: z
    .array(
      z.object({
        number: z
          .string()
          .trim()
          .transform((val) => (val === '' ? undefined : val))
          .optional()
          .transform((val) => {
            if (val) {
              const cleanedPhone = val.replace(/\D/g, '');
              return cleanedPhone.length > 0 ? cleanedPhone : undefined;
            }
            return val;
          })
          .refine((val) => !val || (val.length >= 10 && val.length <= 11), 'Telefone deve ter 10 ou 11 dígitos')
          .transform((val) => (val ? numClean(val) : undefined)),
        tag: z.string().trim().min(1, lengthMessage(1, 24)).max(24, lengthMessage(1, 24)).optional(),
      }),
    )
    .optional(),
  cep: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .transform((val) => {
      if (val) {
        const cleanedCep = val.replace(/\D/g, '');
        return cleanedCep.length > 0 ? cleanedCep : undefined;
      }
      return val;
    })
    .refine((val) => !val || val.length === 8, lengthMessage(8, 8))
    .transform((val) => (val ? numClean(val) : undefined)),
  address: z
    .string()
    .trim()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || (val.length >= 5 && val.length <= 50), lengthMessage(5, 50)),
});

export const patientOdontogramSchema = z.object({
  odontogram: z.array(
    z.object({
      number: z.number().positive(),
      status: z.enum(['normal', 'restored', 'caries', 'missing', 'implant', 'periodontitis', 'prosthesis', 'extracted', 'other']),
    }),
  ),
});

export const anamnesisSchema = z.object({
  mainComplaint: z.string().trim().max(250, lengthMessage(0, 250)),
  gumsBleedEasily: z.enum(['true', 'false']),
  sensitiveTeeth: z.enum(['true', 'false']),
  allergicToMedication: z.enum(['true', 'false']),
  medicationAllergy: z.string().trim().max(120, lengthMessage(0, 120)),
  bitesPenOrPencil: z.enum(['true', 'false']),
  nailsBiting: z.enum(['true', 'false']),
  otherHarmfulHabits: z.string().trim().max(120, lengthMessage(0, 120)),
  pregnant: z.enum(['true', 'false']),
  pregnancyMonth: z.number().max(10).min(0),
  breastfeeding: z.enum(['true', 'false']),
  underMedicalTreatment: z.enum(['true', 'false']),
  medicalTreatmentDetails: z.string().trim().max(120, lengthMessage(0, 120)),
  takingMedication: z.enum(['true', 'false']),
  medicationDetails: z.string().trim().max(120, lengthMessage(0, 120)),
  infectiousDisease: z.string().trim().max(120, lengthMessage(0, 120)),
  smoker: z.enum(['true', 'false']),
  alcoholConsumer: z.enum(['true', 'false']),
  illnesses: z.object({
    diabetes: z.enum(['true', 'false']),
    tuberculosis: z.enum(['true', 'false']),
    heartProblems: z.enum(['true', 'false']),
    arthritis: z.enum(['true', 'false']),
    asthma: z.enum(['true', 'false']),
    highBloodPressure: z.enum(['true', 'false']),
    kidneyProblems: z.enum(['true', 'false']),
    liverProblems: z.enum(['true', 'false']),
    otherIllnesses: z.string().trim().max(120, lengthMessage(0, 120)).default(''),
  }),
  importantHealthInformation: z.string().trim().max(250, lengthMessage(0, 250)),
});

export const intraoralSchema = z.object({
  hygiene: z.enum(['normal', 'regular', 'deficiente']),
  halitosis: z.enum(['ausente', 'moderada', 'forte']),
  tartar: z.enum(['ausente', 'pouco', 'muito']),
  gums: z.enum(['normal', 'gengivite', 'periodontite']),
  mucosa: z.enum(['normal', 'alterada']),
  tongue: z.string().trim().max(120, lengthMessage(0, 120)),
  palate: z.string().trim().max(120, lengthMessage(0, 120)),
  oralFloor: z.string().trim().max(120, lengthMessage(0, 120)),
  lips: z.string().trim().max(120, lengthMessage(0, 120)),
  otherObservations: z.string().trim().max(250, lengthMessage(0, 250)),
});

export type NewPatient = z.infer<typeof patientSchema>;
export type NewPatientOdontogram = z.infer<typeof patientOdontogramSchema>;
export type NewAnamnesis = z.infer<typeof anamnesisSchema>;
export type NewIntraoral = z.infer<typeof intraoralSchema>;
export type UpdateAnamnesis = z.infer<typeof anamnesisSchema> & {
  updatedAt: Date | string;
};
export type UpdateIntraoral = z.infer<typeof intraoralSchema> & {
  updatedAt: Date | string;
};
