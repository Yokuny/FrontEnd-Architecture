import { CalendarCheck, Check, MoreVertical, Phone } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import DefaultEmptyData from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { extractDate } from '@/lib/helpers/formatter.helper';
import type { DbReminder } from '@/lib/interfaces';
import { useCheckReminders } from '@/query/reminders';

const openWhatsApp = (phoneNumber: string) => {
  const phone = phoneNumber.replace(/\D/g, '');
  window.open(`https://wa.me/+55${phone}`, '_blank');
};

export function RemindersList({ reminders }: { reminders: DbReminder[] }) {
  const checkReminders = useCheckReminders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(reminders.map((r) => r._id));
      } else {
        setSelectedIds([]);
      }
    },
    [reminders],
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((selectedId) => selectedId !== id);
    });
  }, []);

  const handleBulkCheck = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos um lembrete');
      return;
    }

    try {
      await checkReminders.mutateAsync({ ids: selectedIds, status: 'done' });
      toast.success(`${selectedIds.length} lembrete${selectedIds.length > 1 ? 's' : ''} concluído${selectedIds.length > 1 ? 's' : ''}`);
      setSelectedIds([]);
    } catch (e: unknown) {
      toast.error((e as Error).message || 'Erro ao concluir lembretes');
    }
  };

  const allSelected = selectedIds.length > 0 && selectedIds.length === reminders.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < reminders.length;

  const columns = useMemo<DataTableColumn<DbReminder>[]>(
    () => [
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
        render: (_, reminder) => {
          const isSelected = selectedIds.includes(reminder._id);
          return (
            <div className={`flex items-center gap-4 ${reminder.status === 'done' ? 'opacity-60' : ''}`}>
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-md ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <CalendarCheck className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-base">{reminder.Patient.name}</span>
                <span className="text-muted-foreground text-sm">{reminder.description}</span>
                <span className="text-muted-foreground text-xs">Retorno em: {extractDate(reminder.scheduledDate, 'short')}</span>
              </div>
            </div>
          );
        },
      },
      {
        key: 'description',
        header: '',
        width: '50px',
        render: (_, reminder) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {reminder.Patient.phone?.[0] && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    openWhatsApp(reminder.Patient.phone?.[0]?.number || '');
                  }}
                >
                  <Phone className="mr-2 size-4" />
                  Conversar (WhatsApp)
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await checkReminders.mutateAsync({ ids: [reminder._id], status: 'done' });
                    toast.success('Concluído');
                  } catch (err: unknown) {
                    toast.error((err as Error).message || 'Erro');
                  }
                }}
              >
                <Check className="mr-2 size-4" />
                Marcar como concluído
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [selectedIds, allSelected, someSelected, checkReminders, handleSelectAll],
  );

  if (reminders.length === 0) {
    return <DefaultEmptyData />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 px-4 pb-2">
        <h3 className="font-medium text-muted-foreground text-sm">{selectedIds.length > 0 ? `${selectedIds.length} selecionado(s)` : 'Selecione lembretes'}</h3>
        <Button onClick={handleBulkCheck} disabled={checkReminders.isPending || selectedIds.length === 0} size="sm" className="gap-2">
          Concluir <Check className="size-4" />
        </Button>
      </div>

      <DataTable
        data={reminders}
        columns={columns}
        searchable={false}
        showPagination={true}
        itemsPerPage={10}
        bordered={true}
        onRowClick={(row) => {
          const isSelected = selectedIds.includes(row._id);
          handleSelectOne(row._id, !isSelected);
        }}
      />
    </div>
  );
}
