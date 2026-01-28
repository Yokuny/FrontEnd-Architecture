import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import type { FasAnalyticsFilters } from '@/hooks/use-fas-analytics-api';
import { useFasValueGroupedCount } from '@/hooks/use-fas-analytics-api';
import type { FasAnalyticsSearch } from '../@interface/fas-analytics.schema';

interface FasValueChartProps {
  search: FasAnalyticsSearch;
}

export function FasValueChart({ search }: FasValueChartProps) {
  const { t } = useTranslation();

  const filters: FasAnalyticsFilters = {
    dependantAxis: (search.dependantAxis as 'month' | 'year' | 'vessel') || 'month',
    service_date_gte: search.startDate,
    service_date_lte: search.endDate,
    service_date_month: search.month,
    service_date_year: search.year,
    vessel_id: search.vesselId,
    type: search.fasType,
  };

  const { data, isLoading } = useFasValueGroupedCount(filters);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => {
      let name = t('undefined');
      if (filters.dependantAxis === 'vessel') {
        name = item.vesselName || item.vessel || t('undefined');
      } else if (filters.dependantAxis === 'year') {
        name = item.year?.toString() || t('undefined');
      } else {
        name = item.month || t('undefined');
      }
      return {
        name,
        [t('value.with.payment')]: item.totalWithPaymentDate,
        [t('value.without.payment')]: item.totalWithoutPaymentDate,
        [t('fas.quantity')]: item.count,
      };
    });
  }, [data, filters.dependantAxis, t]);

  const chartConfig: ChartConfig = {
    [t('value.with.payment')]: {
      label: t('value.with.payment'),
      color: getChartColor(0),
    },
    [t('value.without.payment')]: {
      label: t('value.without.payment'),
      color: getChartColor(5),
    },
    [t('fas.quantity')]: {
      label: t('fas.quantity'),
      color: getChartColor(10),
    },
  };

  if (isLoading) return <DefaultLoading />;
  if (!chartData || chartData.length === 0) return <DefaultEmptyData />;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="font-bold text-lg">{t('fas.bms.value.chart')}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ChartContainer config={chartConfig} className="h-[50vh] w-full">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tickLine={false} axisLine={false} fontSize={12} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => (value >= 1000 ? `${value / 1000}K` : value)} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar yAxisId="left" dataKey={t('value.with.payment')} stackId="a" fill={getChartColor(0)} radius={[0, 0, 0, 0]} />
            <Bar yAxisId="left" dataKey={t('value.without.payment')} stackId="a" fill={getChartColor(1)} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey={t('fas.quantity')} stroke={getChartColor(2)} strokeWidth={2} dot />
          </ComposedChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}
