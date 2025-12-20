import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// Types
export interface UserTeamMember {
  idUser: string;
  nameUser: string;
  idEnterprise: string;
}

// Query keys
export const userTeamKeys = {
  all: ['user-team'] as const,
  byEnterprise: (idEnterprise: string) => [...userTeamKeys.all, 'enterprise', idEnterprise] as const,
};

// API functions
async function fetchUserTeamByEnterprise(idEnterprise: string): Promise<UserTeamMember[]> {
  const response = await api.get<UserTeamMember[]>(`/userenterprise/enterprise/users?idEnterprise=${idEnterprise}`);
  return response.data;
}

// Hooks
export function useUserTeamByEnterprise(idEnterprise: string | undefined) {
  return useQuery({
    queryKey: userTeamKeys.byEnterprise(idEnterprise || ''),
    queryFn: () => fetchUserTeamByEnterprise(idEnterprise as string),
    enabled: !!idEnterprise,
  });
}

// Helper hook for select components
export function useUserTeamSelect(idEnterprise: string | undefined) {
  return useUserTeamByEnterprise(idEnterprise);
}

// Helper function to map team members to select options
export function mapUserTeamToOptions(members: UserTeamMember[]) {
  return members
    .map((member) => ({
      value: member.idUser,
      label: member.nameUser,
      data: member,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
