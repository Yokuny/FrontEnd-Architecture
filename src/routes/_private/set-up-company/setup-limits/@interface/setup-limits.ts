import { z } from 'zod';

export const setupLimitsSchema = z.object({
  idEnterprise: z.string().min(1, 'enterprise.required'),
  maxContacts: z.coerce.number().min(0, 'max.contacts.required'),
  maxUsers: z.coerce.number().min(0),
  maxRequestHistorySensorApi: z.coerce.number().min(0),
  maxRequestHistoryFleetApi: z.coerce.number().min(0),
  maxRequestOffhireApi: z.coerce.number().min(0),
});

export type SetupLimitsFormData = z.infer<typeof setupLimitsSchema>;

export interface SetupLimitsResponse {
  idEnterprise: string;
  chatbot?: {
    maxContacts: number;
  };
  user?: {
    maxUsers: number;
  };
  api?: {
    maxRequestHistorySensorApi: number;
    maxRequestHistoryFleetApi: number;
    maxRequestOffhireApi: number;
  };
}

export interface SetupLimitsPayload {
  idEnterprise: string;
  chatbot: {
    maxContacts: number;
  };
  user: {
    maxUsers: number;
  };
  api: {
    maxRequestHistorySensorApi: number;
    maxRequestHistoryFleetApi: number;
    maxRequestOffhireApi: number;
  };
}
