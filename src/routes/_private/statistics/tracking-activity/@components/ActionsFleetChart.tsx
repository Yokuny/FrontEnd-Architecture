'use client';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Pie, PieChart } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingActionsFleet } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE, TOP_BAR_LIMIT } from '../@consts';
import type { ActionsFleetData, TrackingFilters } from '../@interface';

const ACTION_COLORS = Array.from({ length: 6 }, (_, i) => getChartColor(i * 2));

export function ActionsFleetChart({ filters }: ActionsFleetChartProps) {
  const { t } = useTranslation();
  const { data: actionsData, isLoading } = useTrackingActionsFleet(filters);
  const rawActionsData = actionsData as ActionsFleetData[] | undefined;

  const { chartData, chartConfig, totalValue } = React.useMemo(() => {
    if (!Array.isArray(rawActionsData) || rawActionsData.length === 0) {
      return { chartData: [], chartConfig: {}, totalValue: 0 };
    }

    const sortedData = [...rawActionsData].sort((a, b) => b.total - a.total).slice(0, TOP_BAR_LIMIT);
    const total = sortedData.reduce((acc, curr) => acc + curr.total, 0);

    const config: ChartConfig = {
      total: {
        label: t('total'),
      },
    };

    const formattedData = sortedData.map((item, index) => {
      const key = `action_${index}`;
      const name = item.description || item.action || 'VIEW_DATA';
      config[key] = {
        label: name,
        color: ACTION_COLORS[index % ACTION_COLORS.length],
      };
      return {
        name,
        value: item.total,
        fill: ACTION_COLORS[index % ACTION_COLORS.length],
        key,
      };
    });

    return { chartData: formattedData, chartConfig: config, totalValue: total };
  }, [rawActionsData, t]);

  const isEmpty = !rawActionsData || rawActionsData.length === 0;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="flex-col items-center">
        <ItemTitle>{t('actions.fleet')}</ItemTitle>
        <ItemDescription>{t('actions.fleet.distribution.description', 'Distribuição de ações realizadas na frota')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-square max-h-80">
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
                            {t('total', 'Ações')}
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

interface ActionsFleetChartProps {
  filters: TrackingFilters;
}
