import { toast } from 'sonner';
import Mixer from '@/components/icons/Mixer.Icon';
import Pulse from '@/components/icons/Pulse.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/helpers/formatter.helper';
import type { PartialOdontogram } from '@/lib/interfaces/odontogram.interface';

const handleCopy = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.success('Copiado para a área de transferência');
};

export const odontogramColumns = (navigate: (opts: any) => void): DataTableColumn<PartialOdontogram>[] => [
  {
    key: 'patient',
    header: 'Paciente',
    sortable: true,
    render: (_, item) => (
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary">
          <Pulse className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-base">{item.patient}</span>
          <span className="text-muted-foreground text-sm">
            {formatDate(String(item.createdAt))} • {item.procedureCount} Procedimentos
          </span>
        </div>
      </div>
    ),
  },
  {
    key: 'finished',
    header: 'Status',
    render: (_, item) => <div className="flex">{item.finished ? <Badge variant="completed">Finalizado</Badge> : <Badge variant="pending">Em andamento</Badge>}</div>,
  },
  {
    key: '_id',
    header: 'Ações',
    sortable: false,
    width: '60px',
    render: (_, item) => (
      <div className="flex justify-end">
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
            <DropdownMenuItem onClick={() => navigate({ to: '/odontogram/details', search: { id: item._id } })}>Visualizar</DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: '/financial/details', search: { id: item.Financial } });
              }}
            >
              Orçamento
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: '/patient/details', search: { id: item.patientID } });
              }}
            >
              Paciente
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(item.patient);
              }}
            >
              Copiar nome
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
