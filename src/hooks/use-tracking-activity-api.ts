import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { TrackingFilters } from '@/routes/_private/statistics/tracking-activity/@interface';

export const trackingActivityKeys = {
  all: ['tracking-activity'] as const,
  dashboard: (filters: any) => [...trackingActivityKeys.all, 'dashboard', filters] as const,
};

export function useTrackingAccessDay(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'access-day'],
    queryFn: async () => {
      const response = await api.get('/tracking/accessday', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingUserAccessDay(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'user-access-day'],
    queryFn: async () => {
      const response = await api.get('/tracking/useraccessday', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingUsers(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'users'],
    queryFn: async () => {
      const response = await api.get('/tracking/users', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingUsersWhatsapp(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'users-whatsapp'],
    queryFn: async () => {
      const response = await api.get('/tracking/userswhatsapp', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingPaths(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'paths'],
    queryFn: async () => {
      const response = await api.get('/tracking/paths', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingActionsFleet(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'actions-fleet'],
    queryFn: async () => {
      const response = await api.get('/tracking/actionsfleet', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingLocations(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'locations'],
    queryFn: async () => {
      const response = await api.get('/tracking/locations', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingDevices(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'devices'],
    queryFn: async () => {
      const response = await api.get('/tracking/devices', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingUserRMDay(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'user-rm-day'],
    queryFn: async () => {
      const response = await api.get('/tracking/userrmday', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}

export function useTrackingUsersRM(filters: TrackingFilters) {
  return useQuery({
    queryKey: [...trackingActivityKeys.dashboard(filters), 'users-rm'],
    queryFn: async () => {
      const response = await api.get('/tracking/usersrm', { params: filters });
      return response.data;
    },
    enabled: !!filters.idEnterprise,
  });
}
