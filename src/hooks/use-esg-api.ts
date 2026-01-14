import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const esgKeys = {
  all: ['esg'] as const,
  consumption: () => [...esgKeys.all, 'consumption'] as const,
  consumptionList: (filters: any) => [...esgKeys.consumption(), 'list', filters] as const,
  indicators: () => [...esgKeys.all, 'indicators'] as const,
  indicatorsList: (filters: any) => [...esgKeys.indicators(), 'list', filters] as const,
  fleetCii: () => [...esgKeys.all, 'fleet-cii'] as const,
  fleetCiiList: (filters: any) => [...esgKeys.fleetCii(), 'list', filters] as const,
  consumptionMachines: (idEnterprise: string) => [...esgKeys.consumption(), 'machines', idEnterprise] as const,
};

export function useConsumptionMachines(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: esgKeys.consumptionMachines(idEnterprise || ''),
    queryFn: async () => {
      const response = await api.get<{ machine: { id: string; name: string; code: string } }[]>('/consumption/machines', {
        params: { idEnterprise },
      });
      return response.data;
    },
    enabled: !!idEnterprise,
  });
}

// --- Consumption CO2 ---

export interface ConsumptionCO2Data {
  machine: {
    id: string;
    name: string;
    code?: string;
    image?: {
      url: string;
    };
  };
  totalCO2: number;
  totalFuel: number;
  unit: string;
  consumption?: number;
  co2?: number;
  type?: string;
  oilDetails?: {
    type: string;
    consumption: number;
    unit: string;
    co2: number;
  }[];
}

export function useConsumptionCO2(filters: any) {
  return useQuery({
    queryKey: esgKeys.consumptionList(filters),
    queryFn: async () => {
      const response = await api.get<ConsumptionCO2Data[]>('/consumption/co2', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise && !!filters.dateMin && !!filters.dateMax,
  });
}

// --- EEOI / CII Indicators ---

export interface ConsumptionData {
  [fuelType: string]: number;
}

export interface EEOICIIIndicator {
  code: string;
  loadWeight: number;
  distance: number;
  distanceInVoyage: number;
  timeInVoyage: number;
  consumption: ConsumptionData;
  co2: number;
  eeoi: number;
  ciiRef: number;
  ciiAttained: number;
  dd?: {
    d1: number;
    d2: number;
    d3: number;
    d4: number;
  };
  dateTimeEnd: string;
  sequence?: number;
  activities?: string;
  machine?: {
    id: string;
    name: string;
  };
}

export function useEEOICIIIndicators(filters: any, isShowDetails: boolean) {
  const endpoint = isShowDetails ? '/voyageintegration/item/indicators' : '/voyageintegration/list/indicators';
  return useQuery({
    queryKey: esgKeys.indicatorsList({ ...filters, isShowDetails }),
    queryFn: async () => {
      const response = await api.get<EEOICIIIndicator[]>(endpoint, { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

// --- Fleet CII ---

export interface FleetCII {
  idMachine: string;
  machineName: string;
  code?: string;
  image?: {
    url: string;
  };
  dataSheet?: {
    deadWeight: number;
    grossTonnage: number;
  };
  ciiRef: number;
  cii_2023?: number;
  cii_2024?: number;
  cii?: number; // Representing 2025 or current
  dd?: {
    d1: number;
    d2: number;
    d3: number;
    d4: number;
  };
  rating: string;
}

export function useFleetCII(filters: any) {
  return useQuery({
    queryKey: esgKeys.fleetCiiList(filters),
    queryFn: async () => {
      const response = await api.get<FleetCII[]>('/machine/fleet/cii', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}
