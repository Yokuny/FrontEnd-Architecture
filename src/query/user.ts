import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client';
import type { PartialUser } from '@/lib/interfaces/user';

export const userKeys = {
  all: ['user'] as const,
  detail: () => [...userKeys.all, 'detail'] as const,
};

async function fetchUser(): Promise<PartialUser> {
  const res = await request('user/partial', GET());
  if (!res.success) throw new Error(res.message);
  return res.data as PartialUser;
}

export function useUserQuery() {
  return useQuery({
    queryKey: userKeys.detail(),
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
  });
}
