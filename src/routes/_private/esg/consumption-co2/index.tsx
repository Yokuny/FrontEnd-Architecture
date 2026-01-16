import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon, Cpu, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useConsumptionCO2, useConsumptionMachines } from '@/hooks/use-esg-api';
import { cn } from '@/lib/utils';
import { ConsumptionCO2Table } from './@components/ConsumptionCO2Table';
import { ConsumptionCO2Totals } from './@components/ConsumptionCO2Totals';

export const Route = createFileRoute('/_private/esg/consumption-co2/')({
  component: ConsumptionCO2Page,
});

const unitOptions = [
  { label: 'Ton', value: 'T' },
  { label: 'L', value: 'L' },
  { label: 'm³', value: 'm³' },
];

function ConsumptionCO2Page() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [dateMax, setDateMax] = useState<Date>(new Date());
  const [selectedUnit, setSelectedUnit] = useState('L');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  // Specialized machine query for consumption module (ensure correct IDs)
  const machinesQuery = useConsumptionMachines(idEnterprise);

  // Use a state for applied filters to make search manual like legacy
  const [appliedFilters, setAppliedFilters] = useState<any>({
    idEnterprise,
    dateMin: format(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
    dateMax: format(dateMax, "yyyy-MM-dd'T'00:00:00XXX"),
    unit: selectedUnit,
    'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
  });

  const { data, isLoading } = useConsumptionCO2(appliedFilters);

  const handleSearch = useCallback(() => {
    setAppliedFilters({
      idEnterprise,
      dateMin: format(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
      dateMax: format(dateMax, "yyyy-MM-dd'T'00:00:00XXX"),
      unit: selectedUnit,
      'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
    });
  }, [idEnterprise, dateMin, dateMax, selectedUnit, selectedMachines]);

  // Keep appliedFilters in sync with idEnterprise if it changes from global trigger
  // biome-ignore lint/correctness/useExhaustiveDependencies: manual search pattern
  useEffect(() => {
    handleSearch();
  }, [idEnterprise]);

  const totals = useMemo(() => {
    if (!data || data.length === 0) return null;

    const totalFuel = data.reduce((acc, curr) => acc + (curr.consumption || curr.totalFuel || 0), 0);
    const totalCO2 = data.reduce((acc, curr) => {
      if (curr.oilDetails && curr.oilDetails.length > 0) {
        return acc + curr.oilDetails.reduce((oAcc, oCurr) => oAcc + (oCurr.co2 || 0), 0);
      }
      return acc + (curr.co2 || curr.totalCO2 || 0);
    }, 0);

    // Grouping by fuel type for more granular totals if multi-oil
    const fuelTypeTotals: Record<string, number> = {};
    data.forEach((item) => {
      if (item.oilDetails && item.oilDetails.length > 0) {
        item.oilDetails.forEach((oil) => {
          fuelTypeTotals[oil.type] = (fuelTypeTotals[oil.type] || 0) + oil.consumption;
        });
      } else if (item.type) {
        fuelTypeTotals[item.type] = (fuelTypeTotals[item.type] || 0) + (item.consumption || 0);
      }
    });

    return { totalFuel, totalCO2, fuelTypeTotals };
  }, [data]);

  return (
    <Card>
      <CardHeader title={t('esg.co2')} />
      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary">
          <MachineByEnterpriseSelect mode="multi" label={t('machines')} idEnterprise={idEnterprise} value={selectedMachines} onChange={(vals) => setSelectedMachines(vals)} />

          <div className="flex flex-col gap-1.5">
            <Label>{t('unit')}</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="w-32 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('justify-start text-left font-normal w-40 bg-background', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? format(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
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
                <Button variant="outline" className={cn('justify-start text-left font-normal w-40 bg-background', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? format(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
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
        </Item>

        {/* Results Area */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <DefaultLoading />
          ) : (
            <>
              <ConsumptionCO2Table data={data || []} selectedUnit={appliedFilters.unit} />
              {totals && <ConsumptionCO2Totals totals={totals} selectedUnit={appliedFilters.unit} />}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
