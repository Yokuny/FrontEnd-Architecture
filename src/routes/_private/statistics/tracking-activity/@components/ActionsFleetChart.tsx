import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingActionsFleet } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT, DEVICE_COLORS, TOP_BAR_LIMIT } from '../@consts';
import type { ActionsFleetData, TrackingFilters } from '../@interface';

export function ActionsFleetChart({ filters }: ActionsFleetChartProps) {
  useTranslation();
  const { data: rawData, isLoading } = useTrackingActionsFleet(filters);
  const data = rawData as ActionsFleetData[] | undefined;

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        name: item.description || item.action || 'VIEW_DATA',
        value: item.total,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_BAR_LIMIT);
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: DEVICE_COLORS[index % DEVICE_COLORS.length],
      };
    });
    return config;
  }, [chartData]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  return (
    <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}

interface ActionsFleetChartProps {
  filters: TrackingFilters;
}
