import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import type { FasAnalyticsFilters } from '@/hooks/use-fas-analytics-api';
import { useFasRealizedOrders } from '@/hooks/use-fas-analytics-api';
import type { FasAnalyticsSearch } from '../@interface/fas-analytics.schema';

interface RealizedOrdersChartProps {
  search: FasAnalyticsSearch;
}

export function RealizedOrdersChart({ search }: RealizedOrdersChartProps) {
  const { t } = useTranslation();

  const filters: FasAnalyticsFilters = {
    dependantAxis: search.dependantAxis || 'month',
    service_date_gte: search.startDate,
    service_date_lte: search.endDate,
    service_date_month: search.month,
    service_date_year: search.year,
    vessel_id: search.vesselId,
    status: search.status,
    type: search.fasType,
  };

  const { data, isLoading } = useFasRealizedOrders(filters);

  const chartData = useMemo(() => {
    if (!data) return [];

    return data.map((item) => ({
      name: filters.dependantAxis === 'vessel' ? item.vesselName || item.vessel || t('undefined') : item.month || t('undefined'),
      [t('completed')]: item.completedCount,
      [t('not.completed')]: item.notCompletedCount,
    }));
  }, [data, filters.dependantAxis, t]);

  const chartConfig: ChartConfig = {
    [t('completed')]: {
      label: t('completed'),
      color: getChartColor(13), // Green
    },
    [t('not.completed')]: {
      label: t('not.completed'),
      color: getChartColor(8), // Red
    },
  };

  if (isLoading) return <DefaultLoading />;

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="font-semibold text-lg">{t('fas.completed.chart')}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="h-[50vh] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey={t('completed')} stackId="a" fill={getChartColor(13)} radius={[0, 0, 0, 0]} />
              <Bar dataKey={t('not.completed')} stackId="a" fill={getChartColor(8)} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}
