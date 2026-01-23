'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Pie, PieChart } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingPaths } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE, TOP_BAR_LIMIT } from '../@consts';
import type { TrackingFilters, TrackingPathData } from '../@interface';

const PATH_COLORS = Array.from({ length: 10 }, (_, i) => getChartColor(i * 2));

export function TrackingPathsChart({ filters }: TrackingPathsChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingPaths(filters);
  const data = rawData as TrackingPathData[] | undefined;

  const { chartData, chartConfig, totalValue } = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { chartData: [], chartConfig: {}, totalValue: 0 };
    }

    const sortedData = [...data].sort((a, b) => b.total - a.total).slice(0, TOP_BAR_LIMIT);
    const total = sortedData.reduce((acc, curr) => acc + curr.total, 0);

    const config: ChartConfig = {
      total: {
        label: t('total'),
      },
    };

    const formattedData = sortedData.map((item, index) => {
      const key = `path_${index}`;
      const name = item.pathname || item.path || t('unknown');
      config[key] = {
        label: name,
        color: PATH_COLORS[index % PATH_COLORS.length],
      };
      return {
        name,
        value: item.total,
        fill: PATH_COLORS[index % PATH_COLORS.length],
        key,
      };
    });

    return { chartData: formattedData, chartConfig: config, totalValue: total };
  }, [data, t]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  const isEmpty = !data || data.length === 0;

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="flex-col items-center">
        <ItemTitle>{t('paths')}</ItemTitle>
        <ItemDescription>{t('paths.distribution.description', 'Distribuição de acesso por rotas do sistema')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="spect-square max-h-80">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="key" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-3xl">
                            {totalValue.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground font-bold text-[10px] uppercase">
                            {t('total.accesses', 'Acessos')}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="key" />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/6 *:justify-center" />
            </PieChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface TrackingPathsChartProps {
  filters: TrackingFilters;
}
