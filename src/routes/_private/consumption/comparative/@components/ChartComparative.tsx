import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import type { TimeSeriesReading } from '../@interface/consumption-comparative.types';

export function ChartComparative({ data, unit }: ChartComparativeProps) {
  const { t } = useTranslation();

  const chartData = data.map((reading) => ({
    date: format(new Date((reading.timestamp as number) * 1000), 'dd/MM'),
    manual: reading.consumptionManual.value,
    telemetry: reading.consumptionTelemetry.value,
  }));

  const chartConfig = {
    manual: {
      label: t('manual'),
      color: getChartColor(6), // 10 to amber/warning-like
    },
    telemetry: {
      label: t('telemetry'),
      color: getChartColor(0), // sky/info-like
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value} ${unit}`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="manual" fill="var(--color-manual)" radius={4} />
        <Bar dataKey="telemetry" fill="var(--color-telemetry)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

interface ChartComparativeProps {
  data: TimeSeriesReading[];
  unit: string;
}
