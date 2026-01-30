import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
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

  const { data: totalDataResponse, isLoading: isLoadingTotal } = useFasOrderStatusTotal(filters);
  const { data: groupedDataResponse, isLoading: isLoadingGrouped } = useFasOrderStatusGrouped(filters);

  const totalData = (totalDataResponse as any)?.totalData || totalDataResponse;
  const groupedData = (groupedDataResponse as any)?.groupedData || groupedDataResponse;

  const radialData = useMemo(() => {
    if (!totalData || !Array.isArray(totalData)) return [];
    return totalData.map((item, index) => {
      const statusId = item._id ? item._id.replaceAll('.', '-') : '-';
      return {
        name: item._id ? t(`status.${item._id.toLowerCase()}`) : '-',
        value: item.count,
        fill: getChartColor(index),
        status: statusId,
      };
    });
  }, [totalData, t]);

  const totalValue = useMemo(() => {
    if (!totalData || !Array.isArray(totalData)) return 0;
    return totalData.reduce((acc, item: any) => acc + (item.count || 0), 0);
  }, [totalData]);

  const uniqueStatuses = useMemo(() => {
    if (Array.isArray(groupedData) && groupedData.length > 0 && groupedData[0].status) {
      return Object.keys(groupedData[0].status);
    }
    if (Array.isArray(totalData)) {
      return totalData.map((item: any) => (item._id ? item._id.replaceAll('.', '-') : '-'));
    }
    return [];
  }, [groupedData, totalData]);

  const barData = useMemo(() => {
    if (!Array.isArray(groupedData)) return [];
    return groupedData.map((item: any) => {
      let name = '-';

      if (typeof item._id === 'string') {
        name = item._id;
      } else if (item._id && typeof item._id === 'object') {
        if (filters.dependantAxis === 'vessel') {
          name = item._id.vesselName || item._id.vessel || '-';
        } else {
          const month = item._id.month || '-';
          const year = item._id.year ? ` ${item._id.year}` : '';
          name = `${month}${year}`;
        }
      }

      const baseObj: Record<string, string | number> = { name };
      if (item.status) {
        for (const [status, count] of Object.entries(item.status)) {
          const normalizedStatus = status.replaceAll('.', '-');
          const statusKey = t(`status.${normalizedStatus.toLowerCase()}`);
          baseObj[statusKey] = count as number;
        }
      }
      return baseObj;
    });
  }, [groupedData, filters.dependantAxis, t]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      total: {
        label: t('total'),
      },
    };
    uniqueStatuses.forEach((status, index) => {
      const normalizedStatus = status.replaceAll('.', '-');
      const statusKey = t(`status.${normalizedStatus.toLowerCase()}`);
      config[statusKey] = {
        label: statusKey,
        color: getChartColor(index),
      };
      config[normalizedStatus] = {
        label: statusKey,
        color: getChartColor(index),
      };
    });
    return config;
  }, [uniqueStatuses, t]);

  const isLoading = isLoadingTotal || isLoadingGrouped;
  if (isLoading) return <DefaultLoading />;

  const isEmpty = (!radialData || radialData.length === 0) && (!barData || barData.length === 0);
  if (isEmpty) return <DefaultEmptyData />;

  return (
    <ItemGroup className="gap-6">
      <Item variant="outline" className="flex-1">
        <ItemHeader>
          <ItemTitle className="font-bold text-lg">{t('fas.status.total')}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ChartContainer config={chartConfig} className="h-[50vh]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={radialData} dataKey="value" nameKey="status" innerRadius={80} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-4xl">
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            {t('total')}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="status" />} className="flex-wrap" />
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
              {uniqueStatuses.map((status, index) => {
                const statusKey = t(`status.${status.toLowerCase()}`);
                return <Bar key={status} dataKey={statusKey} stackId="a" fill={getChartColor(index)} radius={index === uniqueStatuses.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />;
              })}
            </BarChart>
          </ChartContainer>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
