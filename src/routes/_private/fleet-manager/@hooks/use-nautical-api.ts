import { useQuery } from '@tanstack/react-query';
import cryptoJs from 'crypto-js';
import { api } from '@/lib/api/client';

async function fetchNavtorToken() {
  const { data } = await api.get<{ token: string }>('/integrationthird/navtor/token');
  return data;
}

async function fetchTicketNAV() {
  const { data } = await api.get<{ token: string }>('/integrationthird/ticketNAV');
  return data;
}

const decryptToken = (encryptedToken: string) => {
  try {
    return cryptoJs.AES.decrypt(encryptedToken, `t4y@t%4anV9W3a5d2$`).toString(cryptoJs.enc.Utf8);
  } catch {
    return '';
  }
};

export function useNavtorToken() {
  return useQuery({
    queryKey: ['nautical', 'navtor-token'],
    queryFn: fetchNavtorToken,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useTicketNAV() {
  const query = useQuery({
    queryKey: ['nautical', 'ticket-nav'],
    queryFn: fetchTicketNAV,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    ...query,
    decryptedToken: query.data?.token ? decryptToken(query.data.token) : '',
  };
}
