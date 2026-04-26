import { toast } from 'sonner';
import Check from '@/components/icons/Check.Icon';
import Mixer from '@/components/icons/Mixer.Icon';
import Phone from '@/components/icons/Phone.Icon';
import { BadgeIndicator } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { t } from '@/lib/helpers/translate.helper';
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
      <Checkbox checked={allSelected ? true : someSelected ? 'indeterminate' : false} onCheckedChange={handleSelectAll} aria-label={t('select.all')} className="translate-y-0.5" />
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
    header: t('patient'),
    sortable: true,
    render: (_, reminder) => <span>{reminder.Patient.name}</span>,
  },
  {
    key: 'description',
    header: t('description'),
    sortable: true,
    render: (_, reminder) => <span className="text-muted-foreground">{reminder.description}</span>,
  },
  {
    key: 'scheduledDate',
    header: t('return.date'),
    sortable: true,
    render: (_, reminder) => <div>{formatDate(reminder.scheduledDate)}</div>,
  },
  {
    key: 'status',
    header: t('status'),
    sortable: true,
    render: (_, reminder) => (
      <div className="flex items-center gap-2">
        <BadgeIndicator variant={reminder.status === 'done' ? 'completed' : 'pending'} pulse />
        <span className="text-sm">{reminder.status === 'done' ? t('completed') : t('pending')}</span>
      </div>
    ),
  },
  {
    key: 'createdAt',
    header: t('actions'),
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
            <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await checkReminders.mutateAsync({ ids: [reminder._id], status: 'done' });
                  toast.success(t('completed'));
                } catch {
                  // error handled globally via MutationCache.onError
                }
              }}
            >
              <Check className="size-4 text-muted-foreground" />
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
                  <Phone className="size-4 text-muted-foreground" />
                  {t('whatsapp.chat')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
