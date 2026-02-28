import { useQuery } from '@tanstack/react-query';
import { requestWithoutToken } from '@/lib/api/client';
import type { PasskeyResponse } from '@/lib/interfaces/passkey';

export const passkeyKeys = {
  all: ['passkey'] as const,
  detail: (code: string) => [...passkeyKeys.all, code] as const,
};

async function fetchPasskey(code: string): Promise<PasskeyResponse> {
  const res = await requestWithoutToken(`passkey/${code}`);
  if (!res.success) throw new Error(res.message);
  return res.data as PasskeyResponse;
}

export function usePasskeyQuery(code?: string) {
  return useQuery({
    queryKey: passkeyKeys.detail(code ?? ''),
    queryFn: () => fetchPasskey(code!),
    enabled: !!code,
  });
}
