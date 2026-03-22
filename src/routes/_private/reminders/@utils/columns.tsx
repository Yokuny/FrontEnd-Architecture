import { toast } from 'sonner';
import Check from '@/components/icons/Check.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Phone from '@/components/icons/Phone.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/helpers/formatDate.utils';
import { t } from '@/lib/helpers/translate';
import type { DbReminder } from '@/lib/interfaces';

const openWhatsApp = (phoneNumber: string) => {
  const phone = phoneNumber.replace(/\D/g, '');
  window.open(`https://wa.me/+55${phone}`, '_blank');
};

type ReminderColumnsParams = {
  selectedIds: string[];
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  checkReminders: { mutateAsync: (data: { ids: string[]; status: 'pending' | 'done' }) => Promise<unknown>; isPending: boolean };
};

export const reminderColumns = ({ selectedIds, allSelected, someSelected, handleSelectAll, checkReminders }: ReminderColumnsParams): DataTableColumn<DbReminder>[] => [
  {
    key: '_id',
    header: (
      <Checkbox
        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
        onCheckedChange={handleSelectAll}
        aria-label="Selecionar todos"
        className="translate-y-0.5"
      />
    ),
    width: '40px',
    render: (_, reminder) => {
      const isSelected = selectedIds.includes(reminder._id);
      return (
        <div className="pointer-events-none flex items-center">
          <Checkbox checked={isSelected} />
        </div>
      );
    },
  },
  {
    key: 'Patient',
    header: 'Paciente',
    sortable: true,
    render: (_, reminder) => <span>{reminder.Patient.name}</span>,
  },
  {
    key: 'description',
    header: 'Descrição',
    sortable: true,
    render: (_, reminder) => <span className="text-muted-foreground">{reminder.description}</span>,
  },
  {
    key: 'scheduledDate',
    header: 'Retorno',
    sortable: true,
    render: (_, reminder) => <div>{formatDate(reminder.scheduledDate)}</div>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (_, reminder) => (
      <Badge variant={reminder.status === 'done' ? 'completed' : 'pending'} className="w-20 justify-center">
        {reminder.status === 'done' ? 'Concluído' : 'Pendente'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Ações',
    sortable: false,
    width: '60px',
    render: (_, reminder) => (
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
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await checkReminders.mutateAsync({ ids: [reminder._id], status: 'done' });
                  toast.success(t('completed'));
                } catch (err: unknown) {
                  toast.error((err as Error).message || t('error'));
                }
              }}
            >
              <Check className="mr-2 size-4 text-muted-foreground" />
              {t('mark.as.completed')}
            </DropdownMenuItem>
            {reminder.Patient.phone?.[0] && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openWhatsApp(reminder.Patient.phone?.[0]?.number || '');
                  }}
                >
                  <Phone className="mr-2 size-4 text-muted-foreground" />
                  Conversar (WhatsApp)
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
