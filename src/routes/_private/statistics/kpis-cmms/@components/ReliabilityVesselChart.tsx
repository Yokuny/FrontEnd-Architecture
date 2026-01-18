import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import { findedGroupConfiabilityIndex, getGroupConfiabilityIndex } from '../@consts/cmms-kpis.consts';
import type { KPISCMMSFilters } from '../@interface/kpis-cmms.schema';

export function ReliabilityVesselChart({ filters }: { filters: KPISCMMSFilters & { min: string; max: string } }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCMMSKPIs(filters);

  const chartData = useMemo(() => {
    if (!data) return [];

    const osOpen = data.filter((x) => !x.dataConclusao);
    const vesselsDistincts = [...new Set(osOpen.map((item) => item.embarcacao).filter(Boolean))];

    return vesselsDistincts
      .map((vesselId) => {
        const vesselOrders = osOpen.filter((item) => item.embarcacao === vesselId);
        const assetName = vesselOrders.find((x) => x.assetName)?.assetName || vesselId;

        const vesselList = vesselOrders.filter((item) => !!findedGroupConfiabilityIndex(item.grupoFuncional));
        const totalList = vesselList.reduce((acc, item) => acc + getGroupConfiabilityIndex(item.grupoFuncional), 0);

        return {
          vessel: assetName,
          reliability: vesselList.length ? Number((totalList / vesselList.length).toFixed(1)) : 0,
          fill: getChartColor(3),
        };
      })
      .sort((a, b) => b.reliability - a.reliability);
  }, [data]);

  const chartConfig = {
    reliability: {
      label: t('reliability'),
      color: getChartColor(3),
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline" className="min-w-80 flex-1">
      <ItemHeader className="flex-col items-center gap-1">
        <ItemTitle className="text-lg font-bold">{t('kpis.cmms.reliability.index')}</ItemTitle>
        <ItemDescription>{t('kpis.cmms.reliability.index.description')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} unit="%" />
              <YAxis dataKey="vessel" type="category" tickLine={false} axisLine={false} fontSize={10} width={100} interval={0} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="reliability" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}
