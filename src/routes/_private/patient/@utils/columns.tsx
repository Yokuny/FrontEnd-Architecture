import { toast } from 'sonner';
import Calender from '@/components/icons/Calender.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Package from '@/components/icons/Package.Icon';
import User from '@/components/icons/User.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient.interface';

const handleCopy = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.success('Copiado para a área de transferência');
};

export const patientColumns = (navigate: (opts: any) => void): DataTableColumn<PartialPatient>[] => [
  {
    key: 'name',
    header: 'Nome',
    sortable: true,
    render: (_, row) => <span>{row.name}</span>,
  },
  {
    key: 'sex',
    header: 'Sexo',
    sortable: true,
    render: (_, row) => (
      <Badge variant={row.sex === 'M' ? 'sky' : 'pink'} className="w-8 justify-center">
        {row.sex === 'M' ? 'M' : 'F'}
      </Badge>
    ),
  },
  {
    key: 'phone1',
    header: 'Telefone',
    sortable: true,
    render: (_, row) => <div>{row.phone1 ? formatPhone(row.phone1) : '—'}</div>,
  },
  {
    key: 'phone2',
    header: 'Telefone 2',
    sortable: true,
    render: (_, row) => <div>{row.phone2 ? formatPhone(row.phone2) : '—'}</div>,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    render: (_, row) => <div className="text-muted-foreground lowercase">{row.email ?? '—'}</div>,
  },
  {
    key: '_id',
    header: 'Ações',
    sortable: false,
    width: '60px',
    render: (_, row) => {
      const patient = row;
      return (
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
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/details', search: { id: patient._id } })}>
                <User className="mr-2 size-4 text-muted-foreground" />
                Visualizar cadastro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="mr-2 size-4 text-muted-foreground" />
                Criar odontograma
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 size-4 text-muted-foreground" />
                Criar cobrança
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calender className="mr-2 size-4 text-muted-foreground" />
                Criar agendamento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {patient.phone1 && (
                <DropdownMenuItem onClick={() => handleCopy(patient.phone1)}>
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copiar telefone
                </DropdownMenuItem>
              )}
              {patient.phone2 && (
                <DropdownMenuItem onClick={() => handleCopy(patient.phone2)}>
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copiar telefone 2
                </DropdownMenuItem>
              )}
              {patient.email && (
                <DropdownMenuItem onClick={() => handleCopy(patient.email!)}>
                  <Copy className="mr-2 size-4 text-muted-foreground" />
                  Copiar email
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleCopy(patient.name)}>
                <Copy className="mr-2 size-4 text-muted-foreground" />
                Copiar nome
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
