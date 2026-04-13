import Mixer from '@/components/icons/Mixer.Icon';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { handleCopy } from '@/lib/helpers/formatter.helper';
import type { PartialOdontogram } from '@/lib/interfaces/odontogram.interface';

export const odontogramColumns = (navigate: (opts: any) => void): DataTableColumn<PartialOdontogram>[] => [
  {
    key: 'createdAt',
    header: 'Data',
    sortable: true,
    render: (_, row) => <span className="text-muted-foreground text-sm">{formatDate(row.createdAt)}</span>,
  },
  {
    key: 'patient',
    header: 'Paciente',
    sortable: true,
    render: (_, row) => <span className="font-medium text-base">{row.patient}</span>,
  },
  {
    key: 'procedureCount',
    header: 'Procedimentos',
    sortable: true,
    render: (_, row) => <span className="text-muted-foreground text-sm">{row.procedureCount ?? 0}</span>,
  },
  {
    key: 'finished',
    header: 'Status',
    sortable: true,
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <BadgeIndicator variant={row.finished ? 'completed' : 'pending'} pulse />
        <span className="text-sm">{row.finished ? 'Finalizado' : 'Em andamento'}</span>
      </div>
    ),
  },
  {
    key: '_id',
    header: 'Ações',
    width: '60px',
    render: (_, row) => (
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
              navigate({ to: '/odontogram/details', search: { id: row._id } });
            }}
          >
            Visualizar odontograma
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: '/financial/details', search: { id: row.Financial } });
            }}
          >
            Ver orçamento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: '/patient/details', search: { id: row.patientID } });
            }}
          >
            Ver paciente
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
    ),
  },
];
