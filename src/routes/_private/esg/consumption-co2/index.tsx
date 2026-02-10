import { createFileRoute } from '@tanstack/react-router';
import { CalendarIcon, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect, UnitSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useConsumptionCO2 } from '@/hooks/use-esg-api';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { ConsumptionCO2Table } from './@components/ConsumptionCO2Table';
import { ConsumptionCO2Totals } from './@components/ConsumptionCO2Totals';

export const Route = createFileRoute('/_private/esg/consumption-co2/')({
  staticData: {
    title: 'esg.co2',
    description:
      'Página de monitoramento de emissões de CO₂ por consumo de combustível. Permite calcular e visualizar as emissões totais de dióxido de carbono geradas pela frota com base no consumo de diferentes tipos de combustível (IFO, MDO, MGO) conforme fatores de conversão da IMO. Essencial para compliance com regulamentações DCS, MRV e EU ETS.',
    tags: ['esg', 'environmental', 'ambiental', 'co2', 'emissions', 'emissões', 'fuel', 'combustível', 'imo', 'compliance', 'dcs', 'mrv', 'eu-ets', 'carbon', 'carbono'],
    examplePrompts: [
      'Mostrar emissões de CO₂ da frota no último mês',
      'Calcular emissões por tipo de combustível',
      'Ver consumo de combustível e CO₂ equivalente',
      'Analisar emissões por embarcação no período',
      'Exportar relatório de emissões para compliance DCS',
    ],
    searchParams: [
      { name: 'idMachine[]', type: 'array', description: 'IDs das embarcações selecionadas', example: 'machine-uuid-1,machine-uuid-2' },
      { name: 'dateMin', type: 'string', description: 'Data inicial no formato ISO 8601', example: '2025-01-01T00:00:00+00:00' },
      { name: 'dateMax', type: 'string', description: 'Data final no formato ISO 8601', example: '2025-02-04T23:59:59+00:00' },
      { name: 'unit', type: 'string', description: 'Unidade de medida do consumo (L, m³, ton)', example: 'L' },
    ],
    relatedRoutes: [
      { path: '/_private/esg', relation: 'parent', description: 'Hub ESG - Menu principal de conformidade ambiental' },
      { path: '/_private/esg/indicators-eeoi-cii', relation: 'sibling', description: 'Indicadores EEOI e CII' },
      { path: '/_private/esg/cii-fleet', relation: 'sibling', description: 'Rating CII da frota' },
      { path: '/_private/esg/simulator-cii', relation: 'sibling', description: 'Simulador de CII' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Módulo de consumo de combustível' },
    ],
    entities: ['ConsumptionData', 'Machine', 'Enterprise', 'FuelType', 'EmissionsData'],
    capabilities: [
      'Calcular emissões de CO₂ por combustível (IFO: 3.1166, MDO: 2.68, MGO: 3.206)',
      'Filtrar por embarcações e período',
      'Visualizar consumo em diferentes unidades (L, m³, ton)',
      'Totalizar emissões por tipo de combustível',
      'Monitorar compliance com DCS/MRV/EU ETS',
      'Exportar dados para relatórios regulatórios',
    ],
  },
  component: ConsumptionCO2Page,
});

function ConsumptionCO2Page() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();

  const [dateMin, setDateMin] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [dateMax, setDateMax] = useState<Date>(new Date());
  const [selectedUnit, setSelectedUnit] = useState('L');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  // Use a state for applied filters to make search manual like legacy
  const [appliedFilters, setAppliedFilters] = useState<any>({
    idEnterprise,
    dateMin: formatDate(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
    dateMax: formatDate(dateMax, "yyyy-MM-dd'T'00:00:00XXX"),
    unit: selectedUnit,
    'idMachine[]': selectedMachines.length > 0 ? selectedMachines : undefined,
  });

  const { data, isLoading } = useConsumptionCO2(appliedFilters);

  const handleSearch = useCallback(() => {
    setAppliedFilters({
      idEnterprise,
      dateMin: formatDate(dateMin, "yyyy-MM-dd'T'00:00:00XXX"),
      dateMax: formatDate(dateMax, "yyyy-MM-dd'T'00:00:00XXX"),
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
      <CardHeader />
      <CardContent className="flex flex-col">
        <Item variant="outline" className="bg-secondary">
          <MachineByEnterpriseSelect mode="multi" label={t('assets')} idEnterprise={idEnterprise} value={selectedMachines} onChange={(vals) => setSelectedMachines(vals)} />

          <UnitSelect value={selectedUnit} onChange={(val) => val && setSelectedUnit(val)} />

          <div className="flex flex-col gap-1.5">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMin ? formatDate(dateMin, 'dd MM yyyy') : <span>{t('date.start')}</span>}
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
                <Button variant="outline" className={cn('w-40 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateMax ? formatDate(dateMax, 'dd MM yyyy') : <span>{t('date.end')}</span>}
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

          <Button variant="outline" className="ml-auto gap-2 bg-background" onClick={handleSearch}>
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
