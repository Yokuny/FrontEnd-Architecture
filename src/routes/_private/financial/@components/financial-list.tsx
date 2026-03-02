import { useNavigate } from '@tanstack/react-router';
import { MoreVertical } from 'lucide-react';
import { useMemo } from 'react';

import { Badge, BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { currencyFormat, extractDate, handleCopy, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { PartialFinancial } from '@/lib/interfaces/financial';
import { STATUS_TO_BADGE_VARIANT } from '../@consts/financial.consts';
import { FinancialView } from './financial-view';

export type FinancialListProps = {
  data: PartialFinancial[];
};

export function FinancialList({ data }: FinancialListProps) {
  const navigate = useNavigate();

  const columns = useMemo<DataTableColumn<PartialFinancial>[]>(
    () => [
      {
        key: 'patient',
        header: 'Paciente',
        sortable: true,
        render: (_, financial) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-base">{financial.patient}</span>
            <span className="text-muted-foreground text-sm">{extractDate(financial.updatedAt, '')}</span>
          </div>
        ),
      },
      {
        key: 'price',
        header: 'Valor',
        sortable: true,
        render: (_, financial) => (
          <Badge variant="neutral" className="hidden w-fit tabular-nums md:flex">
            {currencyFormat(financial.price)}
          </Badge>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (_, financial) => {
          const badgeVariant = STATUS_TO_BADGE_VARIANT[financial.status] || 'pending';
          return <BadgeIndicator variant={badgeVariant}>{statusDictionary(financial.status)}</BadgeIndicator>;
        },
      },
      {
        key: '_id',
        header: '',
        width: '50px',
        render: (_, financial) => (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <FinancialView id={financial._id} />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: '/financial/details/$id', params: { id: financial._id } });
                  }}
                >
                  Editar financeiro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(financial.price.toString());
                  }}
                >
                  Copiar preço
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(financial.patient);
                  }}
                >
                  Copiar nome do paciente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
        ),
      },
    ],
    [navigate],
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      searchable={false}
      showPagination={false}
      bordered={true}
      className="py-0"
      onRowClick={(row) => navigate({ to: '/financial/details/$id', params: { id: row._id } })}
    />
  );
}
