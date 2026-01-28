import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import type { FasAnalyticsFilters } from '@/hooks/use-fas-analytics-api';
import { useOrderValueByPaymentDate, useOrderValueGroupedCount } from '@/hooks/use-fas-analytics-api';
import type { FasAnalyticsSearch } from '../@interface/fas-analytics.schema';

export function OrderValueChart({ search }: OrderValueChartProps) {
  const { t } = useTranslation();

  const filters: FasAnalyticsFilters = {
    dependantAxis: (search.dependantAxis as 'month' | 'year' | 'vessel' | 'supplier') || 'month',
    service_date_gte: search.startDate,
    service_date_lte: search.endDate,
    service_date_month: search.month,
    service_date_year: search.year,
    vessel_id: search.vesselId,
    status: search.status,
    type: search.fasType,
  };

  const showPaymentLine = search.showValueByPayment && (filters.dependantAxis === 'month' || filters.dependantAxis === 'year');

  const { data, isLoading } = useOrderValueGroupedCount(filters);
  const { data: paymentData, isLoading: isLoadingPayment } = useOrderValueByPaymentDate(filters);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item, index) => {
      let name = t('undefined');
      if (filters.dependantAxis === 'vessel') {
        name = item.vesselName || item.vessel || t('undefined');
      } else if (filters.dependantAxis === 'supplier') {
        name = item.supplier || t('undefined');
      } else if (filters.dependantAxis === 'year') {
        name = item.year?.toString() || t('undefined');
      } else {
        name = item.month || t('undefined');
      }

      const result: Record<string, string | number> = {
        name,
        [t('value.with.payment')]: item.totalWithPaymentDate,
        [t('value.without.payment')]: item.totalWithoutPaymentDate,
        [t('os.quantity')]: item.count,
      };

      if (showPaymentLine && paymentData && paymentData[index]) {
        result[t('value.by.payment.date')] = paymentData[index].total;
      }

      return result;
    });
  }, [data, paymentData, filters.dependantAxis, showPaymentLine, t]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      [t('value.with.payment')]: {
        label: t('value.with.payment'),
        color: getChartColor(2),
      },
      [t('value.without.payment')]: {
        label: t('value.without.payment'),
        color: getChartColor(6),
      },
      [t('os.quantity')]: {
        label: t('os.quantity'),
        color: getChartColor(10),
      },
    };

    if (showPaymentLine) {
      config[t('value.by.payment.date')] = {
        label: t('value.by.payment.date'),
        color: getChartColor(12),
      };
    }

    return config;
  }, [showPaymentLine, t]);

  const isLoadingAll = isLoading || (showPaymentLine && isLoadingPayment);
  if (isLoadingAll) return <DefaultLoading />;
  if (!chartData || chartData.length === 0) return <DefaultEmptyData />;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="font-bold text-lg">{t('order.bms.value.chart')}</ItemTitle>
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
            <Line yAxisId="right" type="monotone" dataKey={t('os.quantity')} stroke={getChartColor(2)} strokeWidth={2} dot />
            {showPaymentLine && <Line yAxisId="left" type="monotone" dataKey={t('value.by.payment.date')} stroke={getChartColor(3)} strokeWidth={2} dot />}
          </ComposedChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}

interface OrderValueChartProps {
  search: FasAnalyticsSearch;
}
