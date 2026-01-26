import { create } from 'zustand';
import type { IntegrationAsset, IntegrationVoyage, KickVoyageFilter } from '../@interface/voyage-integration';

interface VoyageIntegrationState {
  selectedAsset: IntegrationAsset | null;
  selectedVoyage: IntegrationVoyage | null;
  kickVoyageFilter: KickVoyageFilter | null;

  setSelectedAsset: (asset: IntegrationAsset | null) => void;
  setSelectedVoyage: (voyage: IntegrationVoyage | null) => void;
  setKickVoyageFilter: (filter: KickVoyageFilter | null) => void;

  reset: () => void;
}

export const useVoyageIntegrationStore = create<VoyageIntegrationState>((set) => ({
  selectedAsset: null,
  selectedVoyage: null,
  kickVoyageFilter: null,

  setSelectedAsset: (asset) => set({ selectedAsset: asset, selectedVoyage: null, kickVoyageFilter: null }),
  setSelectedVoyage: (voyage) => set({ selectedVoyage: voyage, kickVoyageFilter: null }),
  setKickVoyageFilter: (filter) => set({ kickVoyageFilter: filter }),

  reset: () => set({ selectedAsset: null, selectedVoyage: null, kickVoyageFilter: null }),
}));
