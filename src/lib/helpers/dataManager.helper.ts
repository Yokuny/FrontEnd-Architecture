import type { PartialFinancial, PartialOdontogram } from '@/lib/interfaces';
import { GET, request } from '../api/fetch.config';

export const refreshOdontogram = async () => {
  const res = await request('odontogram/partial', GET());
  if (!res.success) throw new Error(res.message);

  localStorage.setItem('odontograms', JSON.stringify(res.data as PartialOdontogram[]));
  return res.data as PartialOdontogram[];
};

export const localOdontogram = async (): Promise<PartialOdontogram[]> => {
  const odontogram = localStorage.getItem('odontograms');
  if (odontogram) return JSON.parse(odontogram);

  return refreshOdontogram();
};

export const refreshFinancial = async () => {
  const res = await request('financial/partial', GET());
  if (!res.success) throw new Error(res.message);

  localStorage.setItem('financials', JSON.stringify(res.data as PartialFinancial[]));
  return res.data as PartialFinancial[];
};

export const localFinancial = async (): Promise<PartialFinancial[]> => {
  const financial = localStorage.getItem('financials');
  if (financial) return JSON.parse(financial);

  return refreshFinancial();
};
