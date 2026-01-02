import { useUsersByRoleAndEnterprise } from '@/hooks/use-roles-api';
import { useUsersByEnterprise } from '@/hooks/use-users-api';

/**
 * Custom hook to fetch users in an enterprise that are NOT in a specific role.
 */
export function useUsersNotInRole(idRole: string | undefined, idEnterprise: string | undefined) {
  const usersInEnterpriseQuery = useUsersByEnterprise(idEnterprise);
  const usersInRoleQuery = useUsersByRoleAndEnterprise(idRole, idEnterprise);

  const isLoading = usersInEnterpriseQuery.isLoading || usersInRoleQuery.isLoading;
  const isError = usersInEnterpriseQuery.isError || usersInRoleQuery.isError;
  const isPending = usersInEnterpriseQuery.isPending || usersInRoleQuery.isPending;

  // Combine data
  const data = (() => {
    if (!usersInEnterpriseQuery.data || !usersInRoleQuery.data) return undefined;

    const usersWithRoleIds = usersInRoleQuery.data.users.map((user) => user.id);
    return usersInEnterpriseQuery.data.filter((user) => !usersWithRoleIds.includes(user.id));
  })();

  return {
    data,
    isLoading,
    isError,
    isPending,
    isSuccess: usersInEnterpriseQuery.isSuccess && usersInRoleQuery.isSuccess,
    status: (usersInEnterpriseQuery.status === 'success' && usersInRoleQuery.status === 'success' ? 'success' : 'pending') as 'success' | 'pending' | 'error',
  };
}
