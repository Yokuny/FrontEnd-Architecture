import { createFileRoute } from '@tanstack/react-router';
import type { DateRange } from 'react-day-picker';
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
import { useRemindersList } from './@hooks/use-reminders-list';
import { type SearchParams, searchSchema } from './@interface/reminders.interface';
import { endOfDay, startOfDay } from './@utils/date';

export const Route = createFileRoute('/_private/reminders/')({
  component: RemindersListPage,
  staticData: {
    title: 'Lembretes',
    description: 'Gestão de tarefas pendentes e acompanhamento de lembretes diários.',
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => searchSchema.parse(search),
});

function RemindersListPage() {
  const {
    reminders,
    isLoading,
    showAll,
    page,
    size,
    dateRange,
    setDateRange,
    selectedIds,
    handleBulkCheck,
    handlePageChange,
    handlePageSizeChange,
    handleSelectOne,
    columns,
    checkReminders,
    navigate,
  } = useRemindersList();

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <div className="mt-4 flex w-full flex-col items-center gap-4 sm:mt-0 sm:w-auto sm:flex-row">
            <div className="flex items-center gap-2">
              <Checkbox
                id="showAll"
                checked={showAll}
                onCheckedChange={(checked) => navigate({ search: ((prev: any) => ({ ...prev, showAll: !!checked }) satisfies SearchParams) as any, replace: true } as any)}
              />
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
