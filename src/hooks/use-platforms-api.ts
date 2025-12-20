import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface Platform {
  id: string;
  name: string;
  acronym?: string;
  idEnterprise: string;
}

// Query keys
export const platformsKeys = {
  all: ['platforms'] as const,
  byEnterprise: (idEnterprise: string) => [...platformsKeys.all, 'enterprise', idEnterprise] as const,
};

// API functions
async function fetchPlatformsByEnterprise(idEnterprise: string): Promise<Platform[]> {
  const response = await api.get<Platform[]>(`/platform/enterprise?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function usePlatformsByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: platformsKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => fetchPlatformsByEnterprise(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function usePlatformsSelect(idEnterprise: string | undefined) {
  return usePlatformsByEnterprise(idEnterprise);
}

// Helper function to map platforms to select options
export function mapPlatformsToOptions(platforms: Platform[]) {
  return platforms
    .map((platform) => ({
      value: platform.id,
      label: `${platform.name}${platform.acronym ? ` - ${platform.acronym}` : ''}`,
      data: platform,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
