import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Check, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { SensorTable } from './@components/sensor-table';
import { DAYS_FILTER_OPTIONS, SENSOR_TYPE_OPTIONS } from './@consts/sensor-types.consts';
import { useSensorDataQuery, useSensorMinMaxApi, useSensorMinMaxQuery } from './@hooks/use-sensor-minmax';
import type { SensorMinMaxConfig, SensorMinMaxState } from './@interface/sensor-minmax.types';
import { extractUniqueUnits } from './@utils/sensor-minmax.utils';

const searchParamsSchema = z.object({
  idAsset: z.string().optional(),
  days: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute('/_private/telemetry/sensor-min-max/')({
  component: SensorMinMaxPage,
  validateSearch: searchParamsSchema,
  staticData: {
    title: 'telemetry.sensor-min-max',
    description:
      'Configuração de limites mínimo/máximo de sensores. Permite definir thresholds para alertas e monitoramento de sensores, visualizar valores atuais, mínimos e máximos do período, e filtrar por unidade e tipo de sensor.',
    tags: ['sensor-limits', 'thresholds', 'min-max', 'alerts', 'configuration', 'monitoring-rules', 'sensor-config'],
    examplePrompts: ['Configurar limites de sensores', 'Definir threshold de temperatura', 'Ver valores mínimo e máximo de sensores'],
    searchParams: [
      { name: 'idAsset', type: 'string', description: 'ID da embarcação' },
      { name: 'days', type: 'number', description: 'Período em dias para análise (padrão: 1)' },
    ],
    relatedRoutes: [
      { path: '/_private/telemetry', relation: 'parent', description: 'Hub de telemetria' },
      { path: '/_private/telemetry/datalogger', relation: 'sibling', description: 'Visualização de dados históricos' },
      { path: '/_private/register/sensors', relation: 'alternative', description: 'Cadastro de sensores' },
    ],
    entities: ['Sensor', 'Machine', 'SensorMinMax'],
    capabilities: [
      'Seleção de embarcação',
      'Filtro de período (1/3/7 dias)',
      'Visualização de valores atual/mín/máx',
      'Configuração de limites min/max',
      'Toggle de alerta (isAlert)',
      'Busca por descrição de sensor',
      'Filtro por unidade de medida',
      'Filtro por tipo de sensor (analog/digital)',
      'Validação de min < max',
      'Salvamento em lote',
    ],
  },
});

function SensorMinMaxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: Route.fullPath });
  const { idAsset, days } = Route.useSearch();
  const { idEnterprise } = useEnterpriseFilter();

  const [sensorsMinMax, setSensorsMinMax] = useState<SensorMinMaxState>({});
  const [filter, setFilter] = useState({ searchText: '', unitFilter: '', typeFilter: '' });

  // Queries
  const { data: sensorData, isLoading: isLoadingSensors, refetch } = useSensorDataQuery(idAsset, days, idEnterprise);
  const { data: minMaxConfig, isLoading: isLoadingMinMax } = useSensorMinMaxQuery(idAsset, idEnterprise);
  const { saveMinMax } = useSensorMinMaxApi(idAsset, idEnterprise);

  // Initialize sensorsMinMax from server data
  useEffect(() => {
    if (minMaxConfig?.sensors) {
      const state: SensorMinMaxState = {};
      for (const sensor of minMaxConfig.sensors) {
        state[sensor.idSensor] = sensor;
      }
      setSensorsMinMax(state);
    } else {
      setSensorsMinMax({});
    }
  }, [minMaxConfig]);

  // Reset when asset changes
  useEffect(() => {
    setFilter({ searchText: '', unitFilter: '', typeFilter: '' });
    setSensorsMinMax({});
  }, []);

  const updateSearch = (updates: Partial<z.infer<typeof searchParamsSchema>>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }) });
  };

  const handleChangeMinMax = useCallback((idSensor: string, field: keyof SensorMinMaxConfig, value: number | boolean | null | undefined) => {
    setSensorsMinMax((prev) => ({
      ...prev,
      [idSensor]: {
        ...prev[idSensor],
        idSensor,
        [field]: value,
      },
    }));
  }, []);

  const handleSaveAll = () => {
    const dataToSave = Object.values(sensorsMinMax);

    const invalidSensor = dataToSave.find((s) => s.max !== null && s.min !== null && s.max !== undefined && s.min !== undefined && s.max < s.min);

    if (invalidSensor) {
      const label = sensorData?.find((s) => s.idSensor === invalidSensor.idSensor)?.label || invalidSensor.idSensor;
      toast.warning(t('sensor.min.more.max').replace('{0}', `"${label}"`));
      return;
    }

    saveMinMax.mutate(
      { id: minMaxConfig?.id, sensors: dataToSave },
      {
        onSuccess: () => toast.success(t('save.success')),
      },
    );
  };

  // Filtered data
  const filteredData = useMemo(() => {
    if (!sensorData) return [];
    return sensorData.filter((sensor) => {
      const matchText =
        !filter.searchText || sensor.label?.toLowerCase().includes(filter.searchText.toLowerCase()) || sensor.idSensor?.toLowerCase().includes(filter.searchText.toLowerCase());
      const matchUnit = !filter.unitFilter || sensor.unit === filter.unitFilter;
      const matchType = !filter.typeFilter || sensor.type === filter.typeFilter;
      return matchText && matchUnit && matchType;
    });
  }, [sensorData, filter]);

  const availableUnits = useMemo(() => extractUniqueUnits(sensorData || []), [sensorData]);

  const isLoading = isLoadingSensors || isLoadingMinMax;

  return (
    <Card>
      <CardHeader title={t('sensor.min.max')}>
        <div className="flex items-end gap-4">
          <div className="w-64">
            <MachineByEnterpriseSelect
              mode="single"
              value={idAsset}
              onChange={(v) => updateSearch({ idAsset: v })}
              idEnterprise={idEnterprise}
              label=""
              placeholder={t('select.machine')}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>
              {t('filter')} {t('days')}
            </Label>
            <div className="flex gap-1">
              <ButtonGroup>
                {DAYS_FILTER_OPTIONS.map((option) => (
                  <Button key={option.value} variant={days === option.value ? 'default' : 'outline'} onClick={() => updateSearch({ days: option.value })} className="px-3">
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>
          <Button variant="outline" disabled={!idAsset || isLoading} onClick={() => refetch()}>
            <Search className="mr-2 size-4" />
            {t('search')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !sensorData?.length ? (
          <DefaultEmptyData />
        ) : (
          <>
            {/* Filters */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">{t('search.sensor.description')}</Label>
                <Input placeholder={t('search.sensor.description')} value={filter.searchText} onChange={(e) => setFilter((p) => ({ ...p, searchText: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">{t('filter.by.unit')}</Label>
                <Select value={filter.unitFilter} onValueChange={(v) => setFilter((p) => ({ ...p, unitFilter: v === 'all' ? '' : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.by.unit')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    {availableUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">{t('filter.by.type')}</Label>
                <Select value={filter.typeFilter} onValueChange={(v) => setFilter((p) => ({ ...p, typeFilter: v === 'all' ? '' : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.by.type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    {SENSOR_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SensorTable data={filteredData} sensorsMinMax={sensorsMinMax} onChangeMinMax={handleChangeMinMax} isLoading={saveMinMax.isPending} />
          </>
        )}
      </CardContent>

      {!isLoading && !!filteredData.length && (
        <CardFooter className="justify-end">
          <Button onClick={handleSaveAll} disabled={saveMinMax.isPending}>
            <Check className="mr-2 size-4" />
            {t('save')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
