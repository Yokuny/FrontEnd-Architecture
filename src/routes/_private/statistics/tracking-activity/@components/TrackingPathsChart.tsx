import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingPaths } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT, DEVICE_COLORS, TOP_BAR_LIMIT } from '../@consts';
import type { TrackingFilters, TrackingPathData } from '../@interface';

export function TrackingPathsChart({ filters }: TrackingPathsChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingPaths(filters);
  const data = rawData as TrackingPathData[] | undefined;

  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        name: item.pathname || item.path || t('unknown'),
        value: item.total,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_BAR_LIMIT);
  }, [data, t]);

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

interface TrackingPathsChartProps {
  filters: TrackingFilters;
}
