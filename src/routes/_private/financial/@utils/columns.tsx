import Mixer from '@/components/icons/Mixer.Icon';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { currencyFormat, handleCopy, statusDictionary } from '@/lib/helpers/formatter.helper';
import type { PartialFinancial } from '@/lib/interfaces/financial.interface';
import { STATUS_TO_BADGE_VARIANT } from '../@consts/financial.consts';

export const financialColumns = (navigate: (opts: { to: string; search?: Record<string, string> }) => void): DataTableColumn<PartialFinancial>[] => [
  {
    key: 'updatedAt',
    header: 'Data',
    sortable: true,
    render: (_, row) => <span className="text-muted-foreground text-sm">{formatDate(row.updatedAt)}</span>,
  },
  {
    key: 'patient',
    header: 'Paciente',
    sortable: true,
    render: (_, row) => <span className="font-medium text-base">{row.patient}</span>,
  },
  {
    key: 'price',
    header: 'Valor',
    sortable: true,
    render: (_, row) => <span className="text-muted-foreground text-sm">{currencyFormat(row.price)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (_, row) => {
      const badgeVariant = STATUS_TO_BADGE_VARIANT[row.status] || 'pending';
      return (
        <div className="flex items-center gap-2">
          <BadgeIndicator variant={badgeVariant} pulse />
          <span className="text-sm">{statusDictionary(row.status)}</span>
        </div>
      );
    },
  },
  {
    key: '_id',
    header: 'Ações',
    width: '60px',
    render: (_, row) => (
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Button variant="outline" className="h-7 w-12">
              <Mixer className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: '/financial/details', search: { id: row._id } });
              }}
            >
              Editar financeiro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(row.price.toString());
              }}
            >
              Copiar preço
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(row.patient);
              }}
            >
              Copiar nome do paciente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    ),
  },
];
