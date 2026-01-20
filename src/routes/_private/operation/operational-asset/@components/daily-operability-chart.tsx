import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_MIN_HEIGHT, DATE_FORMATS } from '../@consts/operational-asset.constants';
import type { DailyDataItem } from '../@services/operational-asset.service';

export function DailyOperabilityChart({ data, isLoading }: DailyOperabilityChartProps) {
  const { t } = useTranslation();

  if (isLoading) return <Skeleton className="w-full" style={{ height: CHART_MIN_HEIGHT.DEFAULT }} />;

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), DATE_FORMATS.CHART_DAY),
    value: parseFloat(((item.hoursOperation * 100) / 24).toFixed(2)),
    hours: item.hoursOperation.toFixed(1),
  }));

  const chartConfig = {
    value: {
      label: t('operating.rate'),
      color: getChartColor(0),
    },
  };

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="text-lg">{t('avg.daily.operational')}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} style={{ minHeight: CHART_MIN_HEIGHT.DEFAULT }} className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  label={{
                    value: t('operating.rate'),
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      indicator="dot"
                      nameKey="value"
                      formatter={(value, _name, item) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-baseline gap-1">
                            <div className="size-2 bg-(--color-value)" />
                            <ItemTitle>{t('operating.rate')}:</ItemTitle>
                            <ItemContent>{value}%</ItemContent>
                          </div>
                          <div className="flex items-baseline gap-1 ml-4">
                            <ItemTitle>{t('hours')}:</ItemTitle>
                            <ItemContent>{(item.payload as any).hours}h</ItemContent>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-value)', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface DailyOperabilityChartProps {
  data: DailyDataItem[];
  isLoading?: boolean;
}
