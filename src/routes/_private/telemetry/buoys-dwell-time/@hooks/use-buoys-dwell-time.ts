import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { Buoy, BuoyWithDwellTime, DwellTimeEntry } from '../@interface/buoys-dwell-time.types';

const buoysDwellTimeKeys = {
  all: ['buoys-dwell-time'] as const,
  byEnterprise: (idEnterprise?: string) => [...buoysDwellTimeKeys.all, idEnterprise] as const,
};

async function fetchDwellTimes(idEnterprise: string): Promise<DwellTimeEntry[]> {
  const response = await api.get<DwellTimeEntry[]>(`/dwell-time/${idEnterprise}`);
  return response.data || [];
}

async function fetchBuoysByIds(ids: string[]): Promise<Buoy[]> {
  if (!ids.length) return [];
  const idsString = ids.join(',');
  const response = await api.get<Buoy[]>(`/buoy/by-ids/${idsString}`);
  return response.data || [];
}

async function fetchBuoysWithDwellTime(idEnterprise?: string): Promise<BuoyWithDwellTime[]> {
  if (!idEnterprise) return [];

  const dwellTimes = await fetchDwellTimes(idEnterprise);
  const uniqueBuoyIds = [...new Set(dwellTimes.map((dt) => dt.idBuoy))];
  const buoys = await fetchBuoysByIds(uniqueBuoyIds);

  return buoys.map((buoy) => ({
    ...buoy,
    dwellTimes: dwellTimes.filter((dt) => dt.idBuoy === buoy.id),
  }));
}

export function useBuoysDwellTimeQuery(idEnterprise?: string) {
  return useQuery({
    queryKey: buoysDwellTimeKeys.byEnterprise(idEnterprise),
    queryFn: () => fetchBuoysWithDwellTime(idEnterprise),
    enabled: !!idEnterprise,
  });
}
