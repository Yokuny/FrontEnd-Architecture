import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import type { FasAnalyticsFilters } from '@/hooks/use-fas-analytics-api';
import { useFasHeaderTypesGrouped, useFasHeaderTypesTotal } from '@/hooks/use-fas-analytics-api';
import type { FasAnalyticsSearch } from '../@interface/fas-analytics.schema';

interface HeaderTypesChartProps {
  search: FasAnalyticsSearch;
}

export function HeaderTypesChart({ search }: HeaderTypesChartProps) {
  const { t } = useTranslation();

  const filters: FasAnalyticsFilters = {
    dependantAxis: (search.dependantAxis as 'month' | 'vessel') || 'month',
    service_date_gte: search.startDate,
    service_date_lte: search.endDate,
    service_date_month: search.month,
    service_date_year: search.year,
    vessel_id: search.vesselId,
    type: search.fasType,
  };

  const { data: totalData, isLoading: isLoadingTotal } = useFasHeaderTypesTotal(filters);
  const { data: groupedData, isLoading: isLoadingGrouped } = useFasHeaderTypesGrouped(filters);

  const pieData = useMemo(() => {
    if (!totalData) return [];
    return totalData.map((item, index) => ({
      name: item.type || t('undefined'),
      value: item.count,
      fill: getChartColor(index * 4),
    }));
  }, [totalData, t]);

  const barData = useMemo(() => {
    if (!groupedData) return [];
    return groupedData.map((item) => {
      let name = t('undefined');

      if (typeof item._id === 'string') {
        name = item._id;
      } else if (item._id && typeof item._id === 'object') {
        if (filters.dependantAxis === 'vessel') {
          name = item._id.vesselName || item._id.vessel || t('undefined');
        } else {
          const month = item._id.month || t('undefined');
          const year = item._id.year ? ` ${item._id.year}` : '';
          name = `${month}${year}`;
        }
      }

      const baseObj: Record<string, string | number> = { name };
      if (item.data) {
        for (const d of item.data) {
          baseObj[d.type] = d.count;
        }
      }
      return baseObj;
    });
  }, [groupedData, filters.dependantAxis, t]);

  const uniqueTypes = useMemo(() => {
    if (!groupedData) return [];
    const types = new Set<string>();
    for (const item of groupedData) {
      if (item.data) {
        for (const d of item.data) {
          types.add(d.type);
        }
      }
    }
    return Array.from(types);
  }, [groupedData]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    uniqueTypes.forEach((type, index) => {
      config[type] = {
        label: type,
        color: getChartColor(index),
      };
    });
    return config;
  }, [uniqueTypes]);

  const isLoading = isLoadingTotal || isLoadingGrouped;
  if (isLoading) return <DefaultLoading />;

  const isEmpty = (!pieData || pieData.length === 0) && (!barData || barData.length === 0);
  if (isEmpty) return <DefaultEmptyData />;

  return (
    <ItemGroup className="gap-6">
      <Item variant="outline" className="flex-1">
        <ItemHeader>
          <ItemTitle className="font-bold text-lg">{t('fas.types.total')}</ItemTitle>
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
          <ItemTitle className="font-bold text-lg">{t('fas.types.chart')}</ItemTitle>
        </ItemHeader>
        <ItemContent>
          <ChartContainer config={chartConfig} className="h-[50vh] w-full">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              {uniqueTypes.map((type, index) => (
                <Bar key={type} dataKey={type} stackId="a" fill={getChartColor(index)} radius={index === uniqueTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ChartContainer>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
