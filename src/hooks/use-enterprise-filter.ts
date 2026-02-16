import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useEnterpriseFilter = create<EnterpriseFilterStore>()(
  persist(
    (set) => ({
      idEnterprise: '',
      setIdEnterprise: (id) => set({ idEnterprise: id }),
    }),
    {
      name: 'idEnterprise',
    },
  ),
);

export interface EnterpriseFilterStore {
  idEnterprise: string;
  setIdEnterprise: (id: string) => void;
}
