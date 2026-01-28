import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import type { FasAnalyticsFilters } from '@/hooks/use-fas-analytics-api';
import { useFasOrderStatusGrouped, useFasOrderStatusTotal } from '@/hooks/use-fas-analytics-api';
import type { FasAnalyticsSearch } from '../@interface/fas-analytics.schema';

interface OrderStatusChartProps {
  search: FasAnalyticsSearch;
}

export function OrderStatusChart({ search }: OrderStatusChartProps) {
  const { t } = useTranslation();

  const filters: FasAnalyticsFilters = {
    dependantAxis: (search.dependantAxis as 'month' | 'vessel') || 'month',
    service_date_gte: search.startDate,
    service_date_lte: search.endDate,
    service_date_month: search.month,
    service_date_year: search.year,
    vessel_id: search.vesselId,
    status: search.status,
    type: search.fasType,
  };

  const { data: totalData, isLoading: isLoadingTotal } = useFasOrderStatusTotal(filters);
  const { data: groupedData, isLoading: isLoadingGrouped } = useFasOrderStatusGrouped(filters);

  const pieData = useMemo(() => {
    if (!totalData) return [];
    return totalData.map((item, index) => ({
      name: item.status ? t(`status.${item.status.toLowerCase()}`) : t('undefined'),
      value: item.count,
      fill: getChartColor(index),
    }));
  }, [totalData, t]);

  const barData = useMemo(() => {
    if (!groupedData) return [];
    return groupedData.map((item) => {
      const baseObj: Record<string, string | number> = {
        name: filters.dependantAxis === 'vessel' ? item.vesselName || item.vessel || t('undefined') : item.month || t('undefined'),
      };
      if (item.data) {
        for (const d of item.data) {
          const statusKey = d.status ? t(`status.${d.status.toLowerCase()}`) : t('undefined');
          baseObj[statusKey] = d.count;
        }
      }
      return baseObj;
    });
  }, [groupedData, filters.dependantAxis, t]);

  const uniqueStatuses = useMemo(() => {
    if (!groupedData) return [];
    const statuses = new Set<string>();
    for (const item of groupedData) {
      if (item.data) {
        for (const d of item.data) {
          statuses.add(d.status ? t(`status.${d.status.toLowerCase()}`) : t('undefined'));
        }
      }
    }
    return Array.from(statuses);
  }, [groupedData, t]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    uniqueStatuses.forEach((status, index) => {
      config[status] = {
        label: status,
        color: getChartColor(index * 6),
      };
    });
    return config;
  }, [uniqueStatuses]);

  const isLoading = isLoadingTotal || isLoadingGrouped;
  if (isLoading) return <DefaultLoading />;

  const isEmpty = (!pieData || pieData.length === 0) && (!barData || barData.length === 0);
  if (isEmpty) return <DefaultEmptyData />;

  return (
    <ItemGroup className="gap-6">
      <Item variant="outline" className="flex-1">
        <ItemHeader>
          <ItemTitle className="font-bold text-lg">{t('fas.status.total')}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[50vh]">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={getChartColor(index)} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-2">
        <ItemHeader>
          <ItemTitle className="font-bold text-lg">{t('fas.status.chart')}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ChartContainer config={chartConfig} className="h-[50vh] w-full">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {uniqueStatuses.map((status, index) => (
                <Bar key={status} dataKey={status} stackId="a" fill={getChartColor(index)} radius={index === uniqueStatuses.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ChartContainer>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
