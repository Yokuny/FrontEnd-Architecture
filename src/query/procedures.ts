import { useQuery } from '@tanstack/react-query';
import { GET, request } from '@/lib/api/client.api';
import { procedureSheetDataFormat } from '@/lib/helpers/formatter.helper';
import type { ProcedureData, ProcedureSheet } from '@/lib/interfaces';

export const proceduresKeys = {
  all: ['procedures'] as const,
  lists: () => [...proceduresKeys.all, 'list'] as const,
  list: () => [...proceduresKeys.lists()] as const,
  sheet: () => [...proceduresKeys.all, 'sheet'] as const,
};

async function fetchProcedures(): Promise<ProcedureData[]> {
  const res = await request('procedure', GET());
  if (!res.success) throw new Error(res.message);
  return res.data.procedures as ProcedureData[];
}

export function useProceduresQuery() {
  return useQuery({
    queryKey: proceduresKeys.list(),
    queryFn: fetchProcedures,
  });
}

export function useProceduresSheetQuery() {
  return useQuery({
    queryKey: proceduresKeys.sheet(),
    queryFn: async (): Promise<ProcedureSheet[]> => {
      const res = await request('procedure', GET());
      if (!res.success) throw new Error(res.message);
      return procedureSheetDataFormat(res.data.procedures as ProcedureData[]);
    },
  });
}
