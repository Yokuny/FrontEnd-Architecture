import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { z } from 'zod';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Add from '@/components/icons/Add.Icon';
import Calender from '@/components/icons/Calender.Icon';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { extractDate } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate';
import { useCheckReminders, useRemindersQuery } from '@/query/reminders';
import { reminderColumns } from './@utils/columns';

const searchSchema = z.object({
  showAll: z.boolean().optional().default(false),
  page: z.number().optional().default(1),
  size: z.number().optional().default(10),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/reminders/')({
  component: RemindersListPage,
  staticData: {
    title: 'Lembretes',
    description: 'Gestão de tarefas pendentes e acompanhamento de lembretes diários.',
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

function startOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function endOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

function RemindersListPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { showAll, page, size } = useSearch({ from: '/_private/reminders/' });
  const checkReminders = useCheckReminders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(today),
    to: endOfDay(today),
  });

  const { data: reminders, isLoading } = useRemindersQuery({
    startDate: dateRange?.from ? dateRange.from.toISOString() : startOfDay(today).toISOString(),
    endDate: dateRange?.to ? dateRange.to.toISOString() : endOfDay(today).toISOString(),
    status: showAll ? undefined : 'pending',
  });

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked && reminders) {
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
      const label = selectedIds.length > 1 ? t('reminder.completed.plural') : t('reminder.completed.singular');
      toast.success(`${selectedIds.length} ${label}`);
      setSelectedIds([]);
    } catch (e: unknown) {
      toast.error((e as Error).message || t('error.completing.reminders'));
    }
  };

  const handlePageChange = useCallback((newPage: number) => navigate({ search: (prev) => ({ ...prev, page: newPage }), replace: true }), [navigate]);

  const handlePageSizeChange = useCallback((newSize: number) => navigate({ search: (prev) => ({ ...prev, size: newSize, page: 1 }), replace: true }), [navigate]);

  const allSelected = !!reminders?.length && selectedIds.length === reminders.length;
  const someSelected = selectedIds.length > 0 && (!reminders || selectedIds.length < reminders.length);

  const columns = useMemo(
    () => reminderColumns({ selectedIds, allSelected, someSelected, handleSelectAll, checkReminders }),
    [selectedIds, allSelected, someSelected, handleSelectAll, checkReminders],
  );

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <div className="mt-4 flex w-full flex-col items-center gap-4 sm:mt-0 sm:w-auto sm:flex-row">
            <div className="flex items-center gap-2">
              <Checkbox id="showAll" checked={showAll} onCheckedChange={(checked) => navigate({ search: (prev) => ({ ...prev, showAll: !!checked }), replace: true })} />
              <label htmlFor="showAll" className="cursor-pointer font-medium text-sm leading-none">
                Mostrar todos
              </label>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Calender className="size-4" />
                  <span>{dateRange?.from && dateRange?.to ? `${extractDate(dateRange.from, 'short')} - ${extractDate(dateRange.to, 'short')}` : 'Selecionar período'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (!range) return;
                    setDateRange({
                      from: range.from ? startOfDay(range.from) : undefined,
                      to: range.to ? endOfDay(range.to) : undefined,
                    } as unknown as DateRange);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {selectedIds.length > 0 && (
              <Button onClick={handleBulkCheck} disabled={checkReminders.isPending} className="gap-2">
                Concluir ({selectedIds.length}) <Check className="size-4" />
              </Button>
            )}

            <Button onClick={() => navigate({ to: '/reminders/add' })}>
              <Add className="mr-2 size-4" />
              Adicionar
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading && <DefaultLoading />}
        {!reminders?.length && !isLoading && <DefaultEmptyData />}
        {!!reminders?.length && !isLoading && (
          <DataTable
            data={reminders}
            columns={columns}
            searchable={false}
            showPagination={true}
            page={page}
            size={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            bordered={false}
            onRowClick={(row) => {
              const isSelected = selectedIds.includes(row._id);
              handleSelectOne(row._id, !isSelected);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
