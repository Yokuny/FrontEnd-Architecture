import { create } from 'zustand';
import type { KickVoyageFilter } from '../@interface/voyage-integration';

interface VoyageIntegrationState {
  kickVoyageFilter: KickVoyageFilter | null;

  setKickVoyageFilter: (filter: KickVoyageFilter | null) => void;

  reset: () => void;
}

export const useVoyageIntegrationStore = create<VoyageIntegrationState>((set) => ({
  kickVoyageFilter: null,

  setKickVoyageFilter: (filter) => set({ kickVoyageFilter: filter }),

  reset: () => set({ kickVoyageFilter: null }),
}));
