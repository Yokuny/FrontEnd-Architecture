import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import Calender from '@/components/icons/Calender.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Package from '@/components/icons/Package.Icon';
import Sort from '@/components/icons/Sort.Icon';
import User from '@/components/icons/User.Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import type { PartialPatient } from '@/lib/interfaces/patient';

const handleCopy = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.success('Copiado para a área de transferência');
};

const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <div className="flex cursor-pointer select-none items-center gap-1 hover:text-foreground" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    {title}
    <Sort className="size-3" />
  </div>
);

export const patientColumns = (navigate: (opts: any) => void): ColumnDef<PartialPatient>[] => [
  {
    accessorKey: 'name',
    enableHiding: false,
    header: ({ column }) => <SortableHeader column={column} title="Nome" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={row.original.image} alt={row.original.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'sex',
    enableHiding: true,
    header: ({ column }) => <SortableHeader column={column} title="Sexo" />,
    cell: ({ row }) => (
      <Badge variant={row.original.sex === 'M' ? 'neutral' : 'pink'} className="w-8 justify-center">
        {row.original.sex === 'M' ? 'M' : 'F'}
      </Badge>
    ),
  },
  {
    accessorKey: 'phone1',
    enableHiding: true,
    header: ({ column }) => <SortableHeader column={column} title="Telefone" />,
    cell: ({ row }) => <div>{row.original.phone1 ? formatPhone(row.original.phone1) : '—'}</div>,
  },
  {
    accessorKey: 'phone2',
    enableHiding: true,
    header: ({ column }) => <SortableHeader column={column} title="Telefone 2" />,
    cell: ({ row }) => <div>{row.original.phone2 ? formatPhone(row.original.phone2) : '—'}</div>,
  },
  {
    accessorKey: 'email',
    enableHiding: true,
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground lowercase">{row.original.email ?? '—'}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const patient = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="sm" className="h-7 w-12 p-0">
                <Mixer className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/details/$id', params: { id: patient._id } })}>
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
