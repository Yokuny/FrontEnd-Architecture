import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// API functions
async function fetchCmmsEquipment(idEnterprise: string): Promise<string[]> {
  const response = await api.get<string[]>(`/form/cmms/equipment/${idEnterprise}`);
  return response.data;
}

// Hooks
export function useCmmsEquipment(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: ['cmms-equipment', idEnterprise],
    queryFn: () => fetchCmmsEquipment(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useCmmsEquipmentSelect(idEnterprise: string | undefined) {
  return useCmmsEquipment(idEnterprise);
}

// Helper function to map to select options
export function mapCmmsEquipmentToOptions(equipment: string[]) {
  return equipment
    .filter((x) => x)
    .map((item) => ({
      value: item,
      label: item,
      data: item,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
