import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import type { PartialFinancial } from '@/lib/interfaces/financial';
import { financialColumns } from './columns';

export type FinancialListProps = {
  data: PartialFinancial[];
};

export function FinancialList({ data }: FinancialListProps) {
  const navigate = useNavigate();

  const columns = useMemo(() => financialColumns(navigate), [navigate]);

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable
      searchPlaceholder="Buscar..."
      itemsPerPage={5}
      bordered={false}
      onRowClick={(row) => navigate({ to: '/financial/details/$id', params: { id: row._id } })}
    />
  );
}
