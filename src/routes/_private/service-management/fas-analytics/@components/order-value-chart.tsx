import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
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

    const paymentMap = new Map<string, number>();
    if (showPaymentLine && paymentData) {
      paymentData.forEach((p: any) => {
        let key = '';
        if (typeof p._id === 'string') {
          key = p._id;
        } else if (p._id && typeof p._id === 'object') {
          key = `${p._id.month || ''}-${p._id.year || ''}`;
        }
        paymentMap.set(key, p.total);
      });
    }

    return data.map((item) => {
      let name = t('undefined');
      let key = '';

      if (typeof item._id === 'string') {
        name = item._id;
        key = item._id;
      } else if (item._id && typeof item._id === 'object') {
        if (filters.dependantAxis === 'vessel') {
          name = item._id.vesselName || item._id.vessel || t('undefined');
          key = item._id.vessel || '';
        } else if (filters.dependantAxis === 'supplier') {
          name = item._id.supplier || t('undefined');
          key = item._id.supplier || '';
        } else if (filters.dependantAxis === 'year') {
          name = item._id.year?.toString() || t('undefined');
          key = `-${item._id.year || ''}`;
        } else {
          const month = item._id.month || t('undefined');
          const year = item._id.year ? ` ${item._id.year}` : '';
          name = `${month}${year}`;
          key = `${item._id.month || ''}-${item._id.year || ''}`;
        }
      }

      const result: Record<string, string | number> = {
        name,
        [t('value.with.payment')]: item.totalWithPaymentDate,
        [t('value.without.payment')]: item.totalWithoutPaymentDate,
        [t('os.quantity')]: item.count,
      };

      if (showPaymentLine) {
        result[t('value.by.payment.date')] = paymentMap.get(key) || 0;
      }

      return result;
    });
  }, [data, paymentData, filters.dependantAxis, showPaymentLine, t]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      [t('value.with.payment')]: {
        label: t('value.with.payment'),
        color: getChartColor(1),
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
        color: getChartColor(14),
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
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => {
                if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
                return value;
              }}
            />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar yAxisId="left" dataKey={t('value.with.payment')} stackId="a" fill={chartConfig[t('value.with.payment')].color} radius={[0, 0, 0, 0]} />
            <Bar yAxisId="left" dataKey={t('value.without.payment')} stackId="a" fill={chartConfig[t('value.without.payment')].color} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey={t('os.quantity')} stroke={chartConfig[t('os.quantity')].color} strokeWidth={4} dot={false} />
            {showPaymentLine && (
              <Line yAxisId="left" type="monotone" dataKey={t('value.by.payment.date')} stroke={chartConfig[t('value.by.payment.date')].color} strokeWidth={4} dot={false} />
            )}
          </ComposedChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}

interface OrderValueChartProps {
  search: FasAnalyticsSearch;
}
