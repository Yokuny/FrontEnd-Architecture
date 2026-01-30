import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

export const fasAnalyticsKeys = {
  all: ['fas-analytics'] as const,
  realizedOrders: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'realized-orders', params] as const,
  headerTypesTotal: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'header-types-total', params] as const,
  headerTypesGrouped: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'header-types-grouped', params] as const,
  orderStatusTotal: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'order-status-total', params] as const,
  orderStatusGrouped: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'order-status-grouped', params] as const,
  fasValue: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'fas-value', params] as const,
  orderValue: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'order-value', params] as const,
  orderValueByPayment: (params?: FasAnalyticsFilters) => [...fasAnalyticsKeys.all, 'order-value-by-payment', params] as const,
};

export interface FasAnalyticsFilters {
  service_date_gte?: string;
  service_date_lte?: string;
  service_date_month?: string;
  service_date_year?: number;
  vessel_id?: string;
  status?: string[];
  type?: string[];
  dependantAxis?: 'month' | 'year' | 'vessel' | 'supplier';
}

function buildParams(filters: FasAnalyticsFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.dependantAxis) params.append('dependantAxis', filters.dependantAxis);
  if (filters.service_date_gte) params.append('service_date_gte', filters.service_date_gte);
  if (filters.service_date_lte) params.append('service_date_lte', filters.service_date_lte);
  if (filters.service_date_month) params.append('service_date_month', filters.service_date_month);
  if (filters.service_date_year) params.append('service_date_year', String(filters.service_date_year));
  if (filters.vessel_id) params.append('vessel_id', filters.vessel_id);
  if (filters.status) {
    for (const s of filters.status) params.append('status', s);
  }
  if (filters.type) {
    for (const t of filters.type) params.append('type', t);
  }
  return params;
}

// Realized Orders Chart
export interface RealizedOrdersData {
  _id?:
    | string
    | null
    | {
        month?: string;
        year?: number;
        vessel?: string;
        vesselName?: string;
      };
  completedCount: number;
  notCompletedCount: number;
}

export function useFasRealizedOrders(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.realizedOrders(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<RealizedOrdersData[]>(`/fas/analytics/realized-os?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

// Header Types Charts
export interface HeaderTypesTotalData {
  _id: string;
  count: number;
}

export interface HeaderTypesGroupedData {
  _id?:
    | string
    | null
    | {
        month?: string;
        year?: number;
        vessel?: string;
        vesselName?: string;
      };
  count: number;
  type: Record<string, number>;
}

export function useFasHeaderTypesTotal(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.headerTypesTotal(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<HeaderTypesTotalData[]>(`/fas/analytics/fas-type-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

export function useFasHeaderTypesGrouped(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.headerTypesGrouped(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<HeaderTypesGroupedData[]>(`/fas/analytics/fas-type-grouped-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

// Order Status Charts
export interface OrderStatusTotalData {
  _id: string;
  count: number;
}

export interface OrderStatusGroupedData {
  _id?:
    | string
    | null
    | {
        month?: string;
        year?: number;
        vessel?: string;
        vesselName?: string;
      };
  count: number;
  status: Record<string, number>;
}

export function useFasOrderStatusTotal(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.orderStatusTotal(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<OrderStatusTotalData[]>(`/fas/analytics/order-status-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

export function useFasOrderStatusGrouped(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.orderStatusGrouped(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<OrderStatusGroupedData[]>(`/fas/analytics/order-status-grouped-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

// FAS Value Chart
export interface FasValueData {
  _id?:
    | string
    | null
    | {
        month?: string;
        year?: number;
        vessel?: string;
        vesselName?: string;
      };
  totalWithPaymentDate: number;
  totalWithoutPaymentDate: number;
  count: number;
}

export function useFasValueGroupedCount(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.fasValue(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<FasValueData[]>(`/fas/analytics/fas-value-grouped-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

// Order Value Chart
export interface OrderValueData {
  _id?:
    | string
    | null
    | {
        month?: string;
        year?: number;
        vessel?: string;
        vesselName?: string;
        supplier?: string;
      };
  totalWithPaymentDate: number;
  totalWithoutPaymentDate: number;
  count: number;
}

export interface OrderValueByPaymentData {
  month?: string;
  year?: number;
  total: number;
}

export function useOrderValueGroupedCount(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.orderValue(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<OrderValueData[]>(`/fas/analytics/order-value-grouped-count?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0,
  });
}

export function useOrderValueByPaymentDate(filters: FasAnalyticsFilters) {
  return useQuery({
    queryKey: fasAnalyticsKeys.orderValueByPayment(filters),
    queryFn: async () => {
      const params = buildParams(filters);
      const response = await api.get<OrderValueByPaymentData[]>(`/fas/analytics/order-value-grouped-count-by-payment-date?${params.toString()}`);
      return response.data;
    },
    enabled: Object.keys(filters).length > 0 && (filters.dependantAxis === 'month' || filters.dependantAxis === 'year'),
  });
}
