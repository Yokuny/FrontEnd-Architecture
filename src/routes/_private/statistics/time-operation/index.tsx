import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, Cpu, Layers, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useConsumptionMachines } from '@/hooks/use-esg-api';
import { useModelMachinesSelect } from '@/hooks/use-model-machines-api';
import { useTimeOperation } from '@/hooks/use-statistics-api';
import { cn } from '@/lib/utils';
import { TimeOperationTable } from './@components/TimeOperationTable';

const searchSchema = z.object({
  idEnterprise: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  'idMachine[]': z.array(z.string()).optional(),
  'idModel[]': z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/statistics/time-operation/')({
  component: TimeOperationPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function TimeOperationPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [dateMax, setDateMax] = useState<Date>(new Date());
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const machinesQuery = useConsumptionMachines(idEnterprise);
  const modelsQuery = useModelMachinesSelect(idEnterprise);

  const [appliedFilters, setAppliedFilters] = useState<any>({
    idEnterprise,
    min: format(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
    max: format(dateMax, "yyyy-MM-dd'T'23:59:59XXX"),
  });

  const { data, isLoading } = useTimeOperation(appliedFilters);

  const handleSearch = useCallback(() => {
    setAppliedFilters({
      idEnterprise,
      min: format(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
      max: format(dateMax, "yyyy-MM-dd'T'23:59:59XXX"),
      'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
      'idModel[]': selectedModels.length > 0 ? selectedModels : undefined,
    });
  }, [idEnterprise, dateMin, dateMax, selectedMachines, selectedModels]);

  useEffect(() => {
    if (idEnterprise) {
      handleSearch();
    }
  }, [idEnterprise, handleSearch]);

  return (
    <Card>
      <CardHeader title={t('time.operation')} />
      <CardContent className="flex flex-col">
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-secondary/50 mb-6">
          <div className="flex flex-col gap-1.5 min-w-[240px]">
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
                items
                  .map(({ machine }: any) => ({
                    value: String(machine.id),
                    label: machine.name,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 min-w-[240px]">
            <Label className="flex items-center gap-2">
              <Layers className="size-4" />
              {t('model')}
            </Label>
            <DataMultiSelect
              placeholder={t('model')}
              query={modelsQuery}
              value={selectedModels}
              onChange={(vals) => setSelectedModels(vals as string[])}
              mapToOptions={(items: any[]) =>
                items
                  .map((model: any) => ({
                    value: String(model.id),
                    label: model.description,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label))
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

        <div className="flex flex-col gap-6">{isLoading ? <DefaultLoading /> : <TimeOperationTable data={data || []} />}</div>
      </CardContent>
    </Card>
  );
}
