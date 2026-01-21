import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format, subDays } from 'date-fns';
import { BrushCleaning, CalendarIcon, Download, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ConsumptionMachineSelect } from '@/components/selects/consumption-machine-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { downloadCSV } from '../daily/@helpers/consumption-daily.helpers';
import { RVERDOItem } from './@components/RVERDOItem';
import { getDataOperationsNormalized } from './@helper/RVERDO.utils';
import { useRVERDOData } from './@hooks/use-rve-rdo-api';
import { searchSchema } from './@interface/rve-rdo.schema';

export const Route = createFileRoute('/_private/consumption/rve-rdo/')({
  component: RVERDODashboardPage,
  validateSearch: searchSchema,
});

function RVERDODashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  // Initialize state from URL params or defaults
  const [dateMin, setDateMin] = useState<Date>(search.initialDate ? new Date(search.initialDate) : subDays(new Date(), 30));
  const [dateMax, setDateMax] = useState<Date>(search.finalDate ? new Date(search.finalDate) : subDays(new Date(), 1));
  const [machineIds, setMachineIds] = useState<string[]>(search.machines ? search.machines.split(',') : []);
  const [showInoperabilities, setShowInoperabilities] = useState<boolean>(search.showInoperabilities ?? true);

  // Derive API filters
  const apiFilters = useMemo(
    () => ({
      idEnterprise,
      machines: machineIds.join(','),
      dateStart: format(dateMin, "yyyy-MM-dd'T'00:00:00'Z'"),
      dateEnd: format(dateMax, "yyyy-MM-dd'T'23:59:59'Z'"),
      showInoperabilities,
    }),
    [idEnterprise, machineIds, dateMin, dateMax, showInoperabilities],
  );

  const { data, isLoading } = useRVERDOData(apiFilters);

  const handleSearch = useCallback(() => {
    navigate({
      search: {
        initialDate: format(dateMin, "yyyy-MM-dd'T'00:00:00'Z'"),
        finalDate: format(dateMax, "yyyy-MM-dd'T'23:59:59'Z'"),
        machines: machineIds.join(','),
        showInoperabilities: showInoperabilities ? 'true' : 'false',
      } as any,
      replace: true,
    });
  }, [navigate, dateMin, dateMax, machineIds, showInoperabilities]);

  const clearFilter = () => {
    setMachineIds([]);
    setDateMin(subDays(new Date(), 30));
    setDateMax(subDays(new Date(), 1));
    setShowInoperabilities(true);
    navigate({
      search: {} as any,
      replace: true,
    });
  };

  const hasFilter = search.machines || search.initialDate || search.finalDate;

  const dataNormalized = useMemo(() => (data ? getDataOperationsNormalized(data) : []), [data]);

  const exportToCSV = () => {
    if (!data) return;

    const csvData = dataNormalized
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .flatMap((item) => {
        const maxInThisDay = item.operations.reduce((acc, op) => acc + (op.consumptionDailyContract ? (op.consumptionDailyContract / 24) * op.diffInHours : 0), 0);

        return item.operations.map((operation, opIndex) => {
          const assetName = data.assets.find((x) => x.id === item.idAsset)?.name;
          return {
            vessel: opIndex === 0 ? assetName : '',
            date: opIndex === 0 ? format(item.date, 'yyyy-MM-dd') : '',
            consumptionEstimated: opIndex === 0 ? (item.consumptionEstimated !== undefined ? item.consumptionEstimated.toFixed(2) : t('not.provided')) : '',
            consumptionMaxDay: opIndex === 0 ? maxInThisDay.toFixed(2) : '',
            diff: opIndex === 0 && item.consumptionEstimated !== undefined ? (item.consumptionEstimated - maxInThisDay).toFixed(2) : '',
            operation: operation.code,
            start: format(operation.dateStart, 'HH:mm'),
            end: format(operation.dateEnd, 'HH:mm'),
            duration: operation.diffInHours.toFixed(2),
            consumptionMaxOperation: operation.consumptionDailyContract ? ((operation.consumptionDailyContract / 24) * operation.diffInHours).toFixed(2) : '0',
          };
        });
      });

    downloadCSV(csvData, `rve_rdo`);
  };

  return (
    <Card>
      <CardHeader title="Dashboard RDO vs RVE">
        {dataNormalized.length > 0 && (
          <Button size="sm" onClick={exportToCSV}>
            <Download className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <Item variant="outline" className="mb-6 flex-row items-end gap-4 overflow-x-auto bg-secondary">
          <ItemContent className="min-w-[300px]">
            <ConsumptionMachineSelect
              mode="multi"
              label={t('vessels')}
              placeholder={t('vessels.select.placeholder')}
              idEnterprise={idEnterprise}
              value={machineIds}
              onChange={(ids) => setMachineIds(ids)}
            />
          </ItemContent>

          <ItemContent className="flex-none">
            <Label>{t('date.start')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMin && 'text-muted-foreground')}>
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
          </ItemContent>

          <ItemContent className="flex-none">
            <Label>{t('date.end')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !dateMax && 'text-muted-foreground')}>
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
          </ItemContent>

          <ItemContent className="flex-none">
            <Label className="mb-2 flex items-center gap-2">
              <span className="size-1" /> {/* Spacer to align with icons */}
              {t('consume')}
            </Label>
            <div className="flex h-10 items-center gap-2 pb-2">
              <Checkbox id="inoperabilities" checked={showInoperabilities} onCheckedChange={(val) => setShowInoperabilities(!!val)} />
              <Label htmlFor="inoperabilities" className="text-xs font-normal leading-tight">
                {t('include.consumption.in')}
              </Label>
            </div>
          </ItemContent>

          <div className="flex flex-row items-center gap-2 pb-1">
            {hasFilter && (
              <Button onClick={clearFilter} className="text-amber-700 hover:text-amber-800">
                <BrushCleaning className="size-4" />
              </Button>
            )}
            <Button variant={hasFilter ? 'default' : 'outline'} onClick={handleSearch} className="gap-2">
              <Search className="size-4" />
              {t('filter')}
            </Button>
          </div>
        </Item>

        {isLoading && <DefaultLoading />}
        {!isLoading && !dataNormalized.length && <DefaultEmptyData />}

        {!isLoading &&
          data &&
          data.assets.map((asset) => (
            <RVERDOItem key={asset.id} asset={asset} data={dataNormalized.filter((item) => item.idAsset === asset.id)} showInoperabilities={showInoperabilities} />
          ))}
      </CardContent>
    </Card>
  );
}
