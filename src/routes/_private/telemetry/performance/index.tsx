import { createFileRoute } from '@tanstack/react-router';
import { Clock, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { SensorByMachineSelect } from '@/components/selects/sensor-by-machine-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { ScatterChart } from './@components/scatter-chart';
import { PERIOD_OPTIONS } from './@consts/performance.consts';
import { usePerformanceDataMutation } from './@hooks/use-performance-data';
import { performanceSearchSchema } from './@interface/performance.schema';
import type { PerformanceData, SensorOption } from './@interface/performance.types';

export const Route = createFileRoute('/_private/telemetry/performance/')({
  component: PerformancePage,
  validateSearch: (search) => performanceSearchSchema.parse(search),
});

function PerformancePage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { idEnterprise } = useEnterpriseFilter();

  // Local state
  const [selectedMachine, setSelectedMachine] = useState<string | undefined>();
  const [sensorX, setSensorX] = useState<string | undefined>();
  const [sensorsY, setSensorsY] = useState<string[]>([]);
  const [period, setPeriod] = useState(search.period || 1);
  const [data, setData] = useState<PerformanceData | null>(null);

  // Sensor options for chart labels (stored when selected)
  const [sensorXOption, setSensorXOption] = useState<SensorOption | null>(null);
  const [sensorsYOptions, setSensorsYOptions] = useState<SensorOption[]>([]);

  // API mutation
  const performanceMutation = usePerformanceDataMutation();

  // Period options with translation
  const periodOptions = useMemo(
    () =>
      PERIOD_OPTIONS.map((opt) => ({
        ...opt,
        label: `${opt.value} ${t(opt.value === 1 ? 'day' : 'days')}`,
      })),
    [t],
  );

  // Reset sensors when machine changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on machine change
  useEffect(() => {
    setSensorX(undefined);
    setSensorsY([]);
    setSensorXOption(null);
    setSensorsYOptions([]);
    setData(null);
  }, [selectedMachine]);

  // Update URL when period changes
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        period,
      }),
      replace: true,
    });
  }, [period, navigate]);

  // Auto-fetch when sensorsY changes (legacy behavior)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional auto-fetch
  useEffect(() => {
    if (selectedMachine && sensorX && sensorsY.length > 0) {
      handleSearch();
    }
  }, [sensorsY]);

  const handleSearch = () => {
    if (!selectedMachine) {
      toast.warning(t('machine.required'));
      return;
    }

    if (!sensorX) {
      toast.warning(t('sensor.required'));
      return;
    }

    if (!sensorsY.length) {
      toast.warning(t('sensor.required'));
      return;
    }

    performanceMutation.mutate(
      {
        idMachine: selectedMachine,
        sensorXId: sensorX,
        sensorYIds: sensorsY,
        lastDays: period,
      },
      {
        onSuccess: (responseData) => {
          setData(responseData);
        },
      },
    );
  };

  const handleSensorXChange = (value: string | undefined) => {
    setSensorX(value);
    if (value) {
      // Store option for chart label
      setSensorXOption({ value, label: value, title: value });
    } else {
      setSensorXOption(null);
    }
  };

  const handleSensorsYChange = (values: string[]) => {
    setSensorsY(values);
    // Store options for chart labels
    setSensorsYOptions(values.map((v) => ({ value: v, label: v, title: v })));
  };

  const isSearchDisabled = performanceMutation.isPending || !sensorX || !sensorsY.length;

  // Transform data for scatter charts
  const getScatterData = (yIndex: number) => {
    if (!data?.data?.length) return [];
    return data.data.map((row) => ({
      x: row[0], // X sensor value (first column after timestamp)
      y: row[yIndex + 1], // Y sensor value
    }));
  };

  return (
    <Card>
      <CardHeader title={t('performance')}>
        <div className="w-64">
          <MachineByEnterpriseSelect
            mode="single"
            idEnterprise={idEnterprise}
            value={selectedMachine}
            onChange={(val: string | undefined) => setSelectedMachine(val)}
            placeholder={t('select.machine')}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!selectedMachine ? (
          <DefaultEmptyData />
        ) : (
          <>
            {/* Filters Bar */}
            <Item variant="outline" className="flex-row flex-wrap items-end gap-4 bg-secondary p-4">
              {/* Period */}
              <ItemContent className="w-32 flex-none">
                <Label className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {t('period')}
                </Label>
                <Select value={String(period)} onValueChange={(val) => setPeriod(Number(val))}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('period')} />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ItemContent>

              {/* Sensor X */}
              <ItemContent className="min-w-[200px] flex-1">
                <SensorByMachineSelect
                  label={`${t('sensor')} X`}
                  idMachine={selectedMachine}
                  value={sensorX}
                  onChange={handleSensorXChange}
                  disabled={performanceMutation.isPending}
                />
              </ItemContent>

              {/* Sensors Y */}
              <ItemContent className="min-w-[300px] flex-2">
                <SensorByMachineSelect
                  label={`${t('sensor')} Y`}
                  idMachine={selectedMachine}
                  values={sensorsY}
                  onChangeMulti={handleSensorsYChange}
                  multi
                  disabled={performanceMutation.isPending}
                />
              </ItemContent>

              {/* Search Button */}
              <div className="ml-auto">
                <Button variant={sensorsY.length > 0 ? 'default' : 'outline'} onClick={handleSearch} disabled={isSearchDisabled} className="gap-2">
                  {performanceMutation.isPending ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  {t('filter')}
                </Button>
              </div>
            </Item>

            {/* Charts Grid */}
            {performanceMutation.isPending ? (
              <DefaultLoading />
            ) : data?.data?.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sensorsYOptions.map((sensorY, index) => (
                  <ScatterChart
                    key={sensorY.value}
                    sensorX={sensorXOption || { value: sensorX || '', label: sensorX || '' }}
                    sensorY={sensorY}
                    data={getScatterData(index)}
                    index={index}
                  />
                ))}
              </div>
            ) : sensorsY.length > 0 && sensorX ? (
              <DefaultEmptyData />
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
