import type { FullFinancial } from '@/lib/interfaces/financial';
import type { DbOdontogram } from '@/lib/interfaces/odontogram';
import type { PasskeyResponse } from '@/lib/interfaces/passkey';
import type { DbSchedule, FullSchedule } from '@/lib/interfaces/schedule';
import { GET, request, requestWithoutToken } from '../api/fetch.config';

interface PatientScheduleData {
  nextEvent: DbSchedule | null;
  futureEvents: DbSchedule[];
  pastEvents: DbSchedule[];
}

export const requestPasskey = async (code: string) => {
  const res = await requestWithoutToken(`passkey/${code}`);
  if (res.success !== true) throw new Error(res.message);

  return res.data as PasskeyResponse;
};

export const requestOdontogram = async (id: string) => {
  const res = await request(`odontogram/${id}`, GET());
  if (res.success !== true) throw new Error(res.message);

  return res.data as DbOdontogram;
};

export const requestFinancial = async (id: string) => {
  const res = await request(`financial/${id}`, GET());
  if (res.success !== true) throw new Error(res.message);

  return res.data as FullFinancial;
};

export const requestSchedule = async (id: string) => {
  const res = await request(`schedule/${id}`, GET());
  if (res.success !== true) throw new Error(res.message);

  return res.data as FullSchedule;
};

export const requestPatientSchedules = async (patientId: string) => {
  const res = await request(`schedule?Patient=${patientId}`, GET());
  if (res.success !== true) throw new Error(res.message);

  return res.data as PatientScheduleData;
};
