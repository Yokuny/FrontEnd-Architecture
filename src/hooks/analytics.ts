import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GET, request } from '@/lib/api/fetch.config';
import type { DbPatientAnalytics } from '@/lib/interfaces/analytics';

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      analytics: null,

      getAnalytics: async () => {
        const { analytics } = get();
        if (analytics) return analytics;

        const res = await request('patient/analytics', GET());
        if (!res.success) {
          throw new Error(res.message || 'Falha ao carregar dados de análise');
        }

        set({ analytics: res.data as DbPatientAnalytics });
        return res.data as DbPatientAnalytics;
      },
    }),
    {
      name: 'patients-analytics',
      partialize: (state) => ({ analytics: state.analytics }),
    },
  ),
);

type AnalyticsStore = {
  analytics: DbPatientAnalytics | null;
  getAnalytics: () => Promise<DbPatientAnalytics>;
};
