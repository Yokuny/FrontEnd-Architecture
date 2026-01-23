import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import type { KPISCMMSFilters } from '../@interface/kpis-cmms.schema';

export function TasksVesselChart({ filters }: { filters: KPISCMMSFilters & { min: string; max: string } }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCMMSKPIs(filters);

  const { chartData, maintenanceTypes } = useMemo(() => {
    if (!data) return { chartData: [], maintenanceTypes: [] };

    const osOpen = data.filter((x) => !x.dataConclusao);
    const vesselsDistincts = [...new Set(osOpen.map((item) => item.embarcacao).filter(Boolean))];
    const mTypes = [...new Set(osOpen.map((item) => item.tipoManutencao || t('undefined')))].sort();

    const formattedData = vesselsDistincts
      .map((vesselId) => {
        const items = osOpen.filter((item) => item.embarcacao === vesselId);
        const assetName = items.find((x) => x.assetName)?.assetName || vesselId;

        const row: any = { vessel: assetName };
        mTypes.forEach((type) => {
          row[type] = items.filter((item) => (item.tipoManutencao || t('undefined')) === type).length;
        });

        return row;
      })
      .sort((a, b) => {
        const totalA = mTypes.reduce((acc, type) => acc + (a[type] || 0), 0);
        const totalB = mTypes.reduce((acc, type) => acc + (b[type] || 0), 0);
        return totalB - totalA;
      });

    return { chartData: formattedData, maintenanceTypes: mTypes };
  }, [data, t]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    maintenanceTypes.forEach((type, index) => {
      config[type] = {
        label: type,
        color: getChartColor(index * 2),
      };
    });
    return config;
  }, [maintenanceTypes]);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline" className="w-full min-w-80">
      <ItemHeader className="flex-col items-center gap-1">
        <ItemTitle className="font-bold text-lg">{t('kpis.cmms.open.tasks.by.vessel')}</ItemTitle>
        <ItemDescription>{t('kpis.cmms.open.tasks.by.vessel.description')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="vessel" angle={-45} textAnchor="end" interval={0} height={80} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {maintenanceTypes.map((type, index) => (
                <Bar key={type} dataKey={type} stackId="a" fill={getChartColor(index * 2)} radius={index === maintenanceTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}
