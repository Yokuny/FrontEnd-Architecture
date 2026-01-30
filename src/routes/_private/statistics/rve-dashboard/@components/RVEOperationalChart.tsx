import { useTranslation } from 'react-i18next';
import { Label, Pie, PieChart } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import type { OperationalCodeData } from '../@interface/rve-dashboard.types';

export function RVEOperationalChart({ data }: RVEOperationalChartProps) {
  const { t } = useTranslation();

  const chartData = data.map((item, index) => ({
    name: item.codigo?.label || item.codigo?.value || '',
    value: item.quantity,
    totalHoras: item.totalHoras,
    fill: getChartColor(index),
  }));

  const totalQuantity = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const chartConfig: ChartConfig = {};
  chartData.forEach((item) => {
    chartConfig[item.name] = {
      label: item.name,
      color: item.fill,
    };
  });

  if (data.length === 0) return null;

  return (
    <Item variant="outline" className="h-full flex-col items-stretch">
      <ItemContent className="relative flex-1">
        <ItemHeader className="absolute flex-col items-center">
          <ItemTitle>{t('rve.dashboard.operationalCodes')}</ItemTitle>
        </ItemHeader>
        <ChartContainer config={chartConfig} className="aspect-square max-h-96">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <div className="flex w-full flex-col">
                      <div className="flex items-center gap-2">
                        <div className={cn('size-3', item.color)} />
                        <ItemTitle className="text-xs uppercase tracking-tight">{name}</ItemTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <ItemTitle className="text-lg tabular-nums">{value.toLocaleString()}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">{t('quantity')}</ItemDescription>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <ItemTitle className="text-lg tabular-nums">{item.payload.totalHoras.toFixed(2)}</ItemTitle>
                        <ItemDescription className="text-xs uppercase">{t('total.hours')}</ItemDescription>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} strokeWidth={5} stroke="var(--color-background)">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-3xl">
                          {totalQuantity.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs uppercase">
                          {t('total')}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} className="mt-4 flex-wrap justify-center gap-2" />
          </PieChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}

interface RVEOperationalChartProps {
  data: OperationalCodeData[];
}
