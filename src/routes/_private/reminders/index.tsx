import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { extractDate } from '@/lib/helpers/formatter.helper';
import { useRemindersQuery } from '@/query/reminders';
import { RemindersList } from './@components/reminders-list';

const searchSchema = z.object({
  showAll: z.boolean().optional().default(false),
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute('/_private/reminders/')({
  component: RemindersListPage,
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
  const { showAll } = useSearch({ from: '/_private/reminders/' });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lembretes</CardTitle>
        <CardAction>
          <div className="mt-4 flex w-full flex-col items-center gap-4 sm:mt-0 sm:w-auto sm:flex-row">
            <div className="flex items-center gap-2">
              <Checkbox id="showAll" checked={showAll} onCheckedChange={(checked) => navigate({ search: { showAll: !!checked } })} />
              <label htmlFor="showAll" className="cursor-pointer font-medium text-sm leading-none">
                Mostrar todos
              </label>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <CalendarIcon className="size-4" />
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

            <Button onClick={() => navigate({ to: '/reminders/add' })}>
              <Plus className="mr-2 size-4" />
              Adicionar
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>{isLoading ? <DefaultLoading /> : <RemindersList reminders={reminders || []} />}</CardContent>
    </Card>
  );
}
