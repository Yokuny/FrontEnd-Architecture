import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Pie, PieChart } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useCMMSKPIs } from '@/hooks/use-cmms-rve-api';
import type { KPISCMMSFilters } from '../@interface/kpis-cmms.schema';

export function DeviationsChart({ filters }: { filters: KPISCMMSFilters & { min: string; max: string } }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCMMSKPIs(filters);

  const { chartData, chartConfig, totalValue } = useMemo(() => {
    if (!data) return { chartData: [], chartConfig: {}, totalValue: 0 };

    const osExpired = data.filter((x) => x.manutencaoVencida === 'Sim' || x.tipoManutencao === 'Corretiva Oriunda de Preditiva');

    const openDeviations = osExpired.filter((x) => !x.dataConclusao).length;
    const executedDeviations = osExpired.filter((x) => x.dataConclusao).length;
    const total = openDeviations + executedDeviations;

    const formattedData = [
      { name: t('kpis.cmms.deviation.open'), value: openDeviations, fill: getChartColor(0), key: 'open' },
      { name: t('kpis.cmms.deviation.executed'), value: executedDeviations, fill: getChartColor(8), key: 'executed' },
    ];

    const config: ChartConfig = {
      open: {
        label: t('kpis.cmms.deviation.open'),
        color: getChartColor(0),
      },
      executed: {
        label: t('kpis.cmms.deviation.executed'),
        color: getChartColor(8),
      },
    };

    return { chartData: formattedData, chartConfig: config, totalValue: total };
  }, [data, t]);

  if (isLoading) return <Skeleton className="h-80 w-full" />;

  const isEmpty = totalValue === 0;

  return (
    <Item variant="outline" className="flex-col items-stretch w-full flex-1">
      <ItemHeader className="items-center flex-col pb-4">
        <ItemTitle className="text-lg font-bold">{t('kpis.cmms.predictive.deviations')}</ItemTitle>
        <ItemDescription>{t('kpis.cmms.predictive.deviations.description')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-square max-h-80 w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => (
                      <div className="flex flex-1 justify-between items-center leading-none gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label || name}</span>
                        </div>
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {value.toLocaleString()} ({((Number(value) / totalValue) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie data={chartData} dataKey="value" nameKey="key" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground uppercase text-[10px] font-bold">
                            {t('total')}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} className="-translate-y-2 flex-wrap gap-2 *:justify-center" />
            </PieChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}
