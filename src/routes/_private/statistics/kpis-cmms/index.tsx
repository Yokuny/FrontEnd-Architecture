import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, Cpu, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useConsumptionMachines } from '@/hooks/use-esg-api';
import { cn } from '@/lib/utils';
import { CMMSPieChart } from './@components/CMMSPieChart';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
  initialDate: z.string().optional(),
  finalDate: z.string().optional(),
  machines: z.string().optional(),
});

export const Route = createFileRoute('/_private/statistics/kpis-cmms/')({
  component: KPISCMMSPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function KPISCMMSPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [dateMax, setDateMax] = useState<Date>(new Date());
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  const machinesQuery = useConsumptionMachines(idEnterprise);

  const [appliedFilters, setAppliedFilters] = useState<any>({
    idEnterprise,
    min: format(dateMin, 'yyyy-MM-dd'),
    max: format(dateMax, 'yyyy-MM-dd'),
  });

  const { data, isLoading } = useCMMSKPIs(appliedFilters);

  const handleSearch = useCallback(() => {
    setAppliedFilters({
      idEnterprise,
      min: format(dateMin, 'yyyy-MM-dd'),
      max: format(dateMax, 'yyyy-MM-dd'),
      idMachines: selectedMachines.length > 0 ? selectedMachines.join(',') : undefined,
    });
  }, [idEnterprise, dateMin, dateMax, selectedMachines]);

  useEffect(() => {
    if (idEnterprise) {
      handleSearch();
    }
  }, [idEnterprise, handleSearch]);

  const chartData = useMemo(() => {
    if (!data) return null;
    const osOpen = data.filter((x: any) => !x.dataConclusao).length;
    const osClosed = data.filter((x: any) => x.dataConclusao).length;

    return [
      { name: t('open'), value: osOpen },
      { name: t('closed'), value: osClosed },
    ];
  }, [data, t]);

  return (
    <Card>
      <CardHeader title="KPI's CMMS" />
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-secondary/50">
          <div className="flex flex-col gap-1.5 min-w-[280px]">
            <Label className="flex items-center gap-2">
              <Cpu className="size-4" />
              {t('machine.placeholder')}
            </Label>
            <DataMultiSelect
              placeholder={t('machine.placeholder')}
              query={machinesQuery}
              value={selectedMachines}
              onChange={(vals) => setSelectedMachines(vals as string[])}
              mapToOptions={(items: any[]) =>
                items.map(({ machine }: any) => ({
                  value: String(machine.id),
                  label: machine.name,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start text-left font-normal w-44 bg-background', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? format(dateMin, 'dd/MM/yyyy') : <span>{t('date.start')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMin}
                  onSelect={(date) => date && setDateMin(date)}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start text-left font-normal w-44 bg-background', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? format(dateMax, 'dd/MM/yyyy') : <span>{t('date.end')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateMax}
                  onSelect={(date) => date && setDateMax(date)}
                  initialFocus
                  captionLayout="dropdown-years"
                  startMonth={new Date(2010, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" className="gap-2 bg-background ml-auto" onClick={handleSearch}>
            <Search className="size-4" />
            {t('search')}
          </Button>
        </div>

        {isLoading ? (
          <DefaultLoading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chartData && (
              <Card className="border shadow-none">
                <CardContent className="pt-6">
                  <CMMSPieChart title={t('tasks.open.vs.closed')} data={chartData} colors={['hsl(var(--destructive))', 'hsl(var(--primary))']} />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
