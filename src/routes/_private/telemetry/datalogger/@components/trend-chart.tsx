import { BarChart3, Download, Eye, EyeOff, Menu } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as UITooltip } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/formatDate';
import type { SensorDataSeries } from '../@interface/datalogger.types';

export function TrendChart({ series, isLoading = false }: TrendChartProps) {
  const { t } = useTranslation();
  const [showDataLabel, setShowDataLabel] = useState(false);
  const [multiAxis, setMultiAxis] = useState(true);

  // Transform series data for Recharts
  const { chartData, chartConfig } = useMemo(() => {
    if (!series.length) {
      return { chartData: [], chartConfig: {} as ChartConfig };
    }

    // Create a map of timestamp -> values
    const dataMap = new Map<number, Record<string, number>>();

    for (const s of series) {
      for (const point of s.data) {
        const existing = dataMap.get(point.timestamp) || { timestamp: point.timestamp };
        existing[s.sensorId] = point.value;
        dataMap.set(point.timestamp, existing);
      }
    }

    // Sort by timestamp
    const chartData = Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp);

    // Create chart config
    const chartConfig: ChartConfig = {};
    for (let i = 0; i < series.length; i++) {
      const s = series[i];
      chartConfig[s.sensorId] = {
        label: s.name,
        color: getChartColor(i),
      };
    }

    return { chartData, chartConfig };
  }, [series]);

  // Download CSV functionality
  const handleDownloadCSV = () => {
    if (!series.length) return;

    const headers = ['Timestamp', ...series.map((s) => s.name)];
    const rows = chartData.map((row) => {
      const date = formatDate(new Date(row.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');
      const values = series.map((s) => row[s.sensorId]?.toFixed(2) ?? '');
      return [date, ...values].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensors_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!series.length) {
    return <div className="flex h-full min-h-[400px] items-center justify-center text-muted-foreground">{t('select.sensors.and.search')}</div>;
  }

  return (
    <div className="relative h-full min-h-[400px]">
      {/* Toolbar */}
      <div className="absolute top-0 left-6 z-10 flex gap-2">
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant={multiAxis ? 'ghost' : 'secondary'} size="icon" className="size-8" onClick={() => setMultiAxis(!multiAxis)}>
                {multiAxis ? <BarChart3 className="size-4" /> : <Menu className="size-4 rotate-90" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(multiAxis ? 'all.y.axis' : 'value.y.axis')}</TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant={showDataLabel ? 'secondary' : 'ghost'} size="icon" className="size-8" onClick={() => setShowDataLabel(!showDataLabel)}>
                {showDataLabel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t(showDataLabel ? 'view.off.value' : 'view.value')}</TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" onClick={handleDownloadCSV}>
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('download.csv')}</TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => formatDate(new Date(value * 1000), 'HH:mm')} />

          {multiAxis ? (
            series.map((s, i) => (
              <YAxis
                key={s.sensorId}
                yAxisId={s.sensorId}
                orientation={i % 2 === 0 ? 'left' : 'right'}
                tickLine={false}
                axisLine
                tickMargin={8}
                tickFormatter={(value) => value?.toFixed(1)}
                stroke={getChartColor(i)}
                width={50}
              />
            ))
          ) : (
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value?.toFixed(1)} />
          )}

          <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => formatDate(new Date(Number(value) * 1000), 'dd/MM/yyyy HH:mm:ss')} />} />

          {series.map((s, i) => (
            <Line
              key={s.sensorId}
              dataKey={s.sensorId}
              name={s.name}
              type="monotone"
              stroke={getChartColor(i)}
              strokeWidth={2}
              dot={showDataLabel}
              yAxisId={multiAxis ? s.sensorId : undefined}
              label={
                showDataLabel
                  ? {
                      position: 'top',
                      fontSize: 10,
                      fill: getChartColor(i),
                      formatter: (value: number) => value?.toFixed(1),
                    }
                  : undefined
              }
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}

interface TrendChartProps {
  series: SensorDataSeries[];
  isLoading?: boolean;
}
