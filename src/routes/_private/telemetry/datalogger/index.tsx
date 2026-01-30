import { createFileRoute } from '@tanstack/react-router';
import { differenceInDays, format, parse } from 'date-fns';
import { CalendarIcon, Clock, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { SensorSelectDialog } from './@components/sensor-select-dialog';
import { TrendChart } from './@components/trend-chart';
import { DEFAULT_INTERVAL_OPTIONS } from './@consts/datalogger.consts';
import { useSensorDataMutation } from './@hooks/use-sensor-data';
import { dataloggerSearchSchema } from './@interface/datalogger.schema';
import type { IntervalOption, SensorDataSeries } from './@interface/datalogger.types';

export const Route = createFileRoute('/_private/telemetry/datalogger/')({
  component: DataloggerPage,
  validateSearch: (search) => dataloggerSearchSchema.parse(search),
});

function DataloggerPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  // Local state
  const [selectedMachine, setSelectedMachine] = useState<string | undefined>();
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [chartData, setChartData] = useState<SensorDataSeries[]>([]);

  // Filter state (synced with URL)
  const [filters, setFilters] = useState({
    dateInit: search.dateInit || '',
    dateEnd: search.dateEnd || '',
    timeInit: search.timeInit || '00:00',
    timeEnd: search.timeEnd || '23:59',
    interval: search.interval || 30,
  });

  // Sensor data mutation
  const sensorDataMutation = useSensorDataMutation();

  // Reset sensors when machine changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on machine change
  useEffect(() => {
    setSelectedSensors([]);
    setChartData([]);
  }, [selectedMachine]);

  // Update URL when filters change
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...filters,
      }),
      replace: true,
    });
  }, [filters, navigate]);

  // Filter Logic (previously in FilterData)
  const intervalOptions = useMemo((): IntervalOption[] => {
    if (!filters.dateInit || !filters.dateEnd) return DEFAULT_INTERVAL_OPTIONS;

    const initDate = parse(filters.dateInit, 'yyyy-MM-dd', new Date());
    const endDate = parse(filters.dateEnd, 'yyyy-MM-dd', new Date());
    const daysDiff = differenceInDays(endDate, initDate);

    // Same day - allow no interval option
    if (daysDiff === 0) {
      return [{ value: 0, label: t('no.interval') }, ...DEFAULT_INTERVAL_OPTIONS];
    }
    if (daysDiff <= 1) return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value >= 1);
    if (daysDiff <= 2) return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value >= 2);
    if (daysDiff <= 3) return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value >= 5);
    if (daysDiff <= 5) return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value >= 10);
    if (daysDiff < 16) return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value > 15);
    return DEFAULT_INTERVAL_OPTIONS.filter((x) => x.value >= 30);
  }, [filters.dateInit, filters.dateEnd, t]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 31);
    return d;
  }, []);

  const parsedDateInit = useMemo(() => (filters.dateInit ? parse(filters.dateInit, 'yyyy-MM-dd', new Date()) : undefined), [filters.dateInit]);
  const parsedDateEnd = useMemo(() => (filters.dateEnd ? parse(filters.dateEnd, 'yyyy-MM-dd', new Date()) : undefined), [filters.dateEnd]);

  // Validation and search handler
  const handleSearch = () => {
    // Validation
    if (!selectedMachine) {
      toast.warning(t('machine.required'));
      return;
    }
    if (!selectedSensors.length) {
      toast.warning(t('sensor.required'));
      return;
    }
    if (!filters.dateInit || !filters.dateEnd) {
      toast.warning(t('date.required'));
      return;
    }

    const dateInit = parse(filters.dateInit, 'yyyy-MM-dd', new Date());
    const dateEnd = parse(filters.dateEnd, 'yyyy-MM-dd', new Date());

    if (dateInit > dateEnd) {
      toast.warning(t('date.end.is.before.date.start'));
      return;
    }

    const daysDiff = differenceInDays(dateEnd, dateInit);
    if (daysDiff > 15) {
      toast.warning(t('interval.required.when.date.range.more.than.15.days'));
      return;
    }

    // Fetch data
    sensorDataMutation.mutate(
      {
        idMachine: selectedMachine,
        dateInit: filters.dateInit,
        dateEnd: filters.dateEnd,
        timeInit: filters.timeInit,
        timeEnd: filters.timeEnd,
        interval: filters.interval,
        sensorIds: selectedSensors,
      },
      {
        onSuccess: (data) => {
          if (data.length) {
            setChartData((prev) => [...prev, ...data]);
          } else {
            setChartData(data);
          }
        },
      },
    );
  };

  const handleDateInitSelect = (date: Date | undefined) => {
    setFilters((f) => ({ ...f, dateInit: date ? format(date, 'yyyy-MM-dd') : '' }));
  };

  const handleDateEndSelect = (date: Date | undefined) => {
    setFilters((f) => ({ ...f, dateEnd: date ? format(date, 'yyyy-MM-dd') : '' }));
  };

  const handleSensorsChange = (sensors: string[]) => {
    // Clear chart when sensors change
    if (sensors.length !== selectedSensors.length) {
      setChartData([]);
    }
    setSelectedSensors(sensors);
  };

  const isSearchDisabled = sensorDataMutation.isPending || !selectedSensors.length || !filters.dateInit || !filters.dateEnd;

  return (
    <Card>
      <CardHeader title={t('telemetry.datalogger')}>
        <div className="w-64">
          <MachineByEnterpriseSelect
            mode="single"
            idEnterprise={idEnterprise}
            value={selectedMachine}
            onChange={(val: string | undefined) => setSelectedMachine(val)}
            placeholder={t('machine.placeholder')}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!selectedMachine ? (
          <DefaultEmptyData />
        ) : (
          <>
            {/* Filters Bar */}
            <Item variant="outline" className="flex-row items-end gap-4 overflow-x-auto bg-secondary p-4">
              {/* Sensor Select */}
              <SensorSelectDialog idMachine={selectedMachine} selectedSensors={selectedSensors} onSensorsChange={handleSensorsChange} disabled={sensorDataMutation.isPending} />

              {/* Date Start */}
              <ItemContent className="flex-none">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  {t('date.start')}
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !filters.dateInit && 'text-muted-foreground')}>
                        {parsedDateInit ? formatDate(parsedDateInit, 'dd MM yyyy') : <span>{t('select.date')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parsedDateInit}
                        onSelect={handleDateInitSelect}
                        disabled={(date) => date > new Date() || date < minDate || (parsedDateEnd ? date > parsedDateEnd : false)}
                        initialFocus
                        captionLayout="dropdown-years"
                        startMonth={minDate}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={filters.timeInit}
                    onChange={(e) => setFilters((f) => ({ ...f, timeInit: e.target.value }))}
                    className="w-24 bg-background"
                    disabled={!filters.dateInit}
                  />
                </div>
              </ItemContent>

              {/* Date End */}
              <ItemContent className="flex-none">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="size-4" />
                  {t('date.end')}
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-44 justify-start bg-background text-left font-normal', !filters.dateEnd && 'text-muted-foreground')}>
                        {parsedDateEnd ? formatDate(parsedDateEnd, 'dd MM yyyy') : <span>{t('select.date')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parsedDateEnd}
                        onSelect={handleDateEndSelect}
                        disabled={(date) => date > new Date() || (parsedDateInit ? date < parsedDateInit : false)}
                        initialFocus
                        captionLayout="dropdown-years"
                        startMonth={minDate}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={filters.timeEnd}
                    onChange={(e) => setFilters((f) => ({ ...f, timeEnd: e.target.value }))}
                    className="w-24 bg-background"
                    disabled={!filters.dateEnd}
                  />
                </div>
              </ItemContent>

              {/* Interval */}
              <ItemContent className="w-40 flex-none">
                <Label className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {t('interval')}
                </Label>
                <Select value={String(filters.interval)} onValueChange={(val) => setFilters((f) => ({ ...f, interval: Number(val) }))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('interval')} />
                  </SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ItemContent>

              <div className="ml-auto flex gap-2">
                <Button variant={selectedSensors.length > 0 ? 'default' : 'outline'} onClick={handleSearch} disabled={isSearchDisabled} className="gap-2">
                  {sensorDataMutation.isPending ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  {t('search')}
                </Button>
              </div>
            </Item>

            {/* Chart */}
            <div className="min-h-[500px]">
              <TrendChart series={chartData} isLoading={sensorDataMutation.isPending} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
