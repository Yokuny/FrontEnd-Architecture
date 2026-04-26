import { toast } from 'sonner';
import Calender from '@/components/icons/Calender.Icon';
import Copy from '@/components/icons/Copy.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Mail from '@/components/icons/Mail.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Package from '@/components/icons/Package.Icon';
import User from '@/components/icons/User.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatPhone } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { PartialPatient } from '@/lib/interfaces/patient.interface';

const handleCopy = (value: string) => {
  navigator.clipboard.writeText(value);
  toast.success(t('copied.to.clipboard'));
};

export const patientColumns = (navigate: (opts: any) => void): DataTableColumn<PartialPatient>[] => [
  {
    key: 'name',
    header: t('name'),
    sortable: true,
    render: (_, row) => <span>{row.name}</span>,
  },
  {
    key: 'sex',
    header: t('sex'),
    sortable: true,
    render: (_, row) => (
      <Badge variant={row.sex === 'M' ? 'sky' : 'pink'} className="w-8 justify-center">
        {row.sex === 'M' ? 'M' : 'F'}
      </Badge>
    ),
  },
  {
    key: 'phone1',
    header: t('phone'),
    sortable: true,
    render: (_, row) => <div>{row.phone1 ? formatPhone(row.phone1) : '—'}</div>,
  },
  {
    key: 'phone2',
    header: t('phone.secondary'),
    sortable: true,
    render: (_, row) => <div>{row.phone2 ? formatPhone(row.phone2) : '—'}</div>,
  },
  {
    key: 'email',
    header: t('email'),
    sortable: true,
    render: (_, row) => <div className="text-muted-foreground lowercase">{row.email ?? '—'}</div>,
  },
  {
    key: '_id',
    header: t('actions'),
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
              <Button className="h-7 w-12">
                <Mixer className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/details', search: { id: patient._id } })}>
                <User className="size-4 text-muted-foreground" />
                {t('view.registration')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: '/patient/add', search: { id: patient._id } })}>
                <Edit className="size-4 text-muted-foreground" />
                {t('edit.registration')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="size-4 text-muted-foreground" />
                {t('create.odontogram')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="size-4 text-muted-foreground" />
                {t('create.billing')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calender className="size-4 text-muted-foreground" />
                {t('create.schedule')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {patient.phone1 && (
                <DropdownMenuItem onClick={() => handleCopy(patient.phone1)}>
                  <Copy className="size-4 text-muted-foreground" />
                  {t('copy.phone')}
                </DropdownMenuItem>
              )}
              {patient.phone2 && (
                <DropdownMenuItem onClick={() => handleCopy(patient.phone2)}>
                  <Copy className="size-4 text-muted-foreground" />
                  {t('copy.phone.secondary')}
                </DropdownMenuItem>
              )}
              {patient.email && (
                <DropdownMenuItem onClick={() => handleCopy(patient.email!)}>
                  <Copy className="size-4 text-muted-foreground" />
                  {t('copy.email')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleCopy(patient.name)}>
                <Copy className="size-4 text-muted-foreground" />
                {t('copy.name')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
