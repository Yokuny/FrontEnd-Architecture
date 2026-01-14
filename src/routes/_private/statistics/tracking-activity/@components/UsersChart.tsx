'use client';

import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ItemContent, ItemFooter } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUsers } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE, DEVICE_COLORS } from '../@consts';
import type { TrackingFilters, TrackingUserData } from '../@interface';

export function UsersChart({ filters }: UsersChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUsers(filters);
  const data = rawData as TrackingUserData[] | undefined;

  const { chartData, chartConfig, totalActions, topKeys } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { chartData: [], chartConfig: {}, totalActions: 0, topKeys: [] };
    }

    const sortedData = [...data].sort((a, b) => b.total - a.total);
    const topUsers = sortedData.slice(0, 5);
    const totalActions = sortedData.reduce((acc, item) => acc + item.total, 0);

    const dataObj: any = { name: 'Users' };
    const config: ChartConfig = {};
    const keys: string[] = [];

    topUsers.forEach((item, index) => {
      const key = `user${index}`;
      dataObj[key] = item.total;
      config[key] = {
        label: item.user || t('unknown'),
        color: DEVICE_COLORS[index % DEVICE_COLORS.length],
      };
      keys.push(key);
    });

    return { chartData: [dataObj], chartConfig: config, totalActions, topKeys: keys };
  }, [data, t]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  return (
    <>
      <ItemContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {totalActions.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          {t('actions')}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            {topKeys.map((key, index) => (
              <RadialBar key={key} dataKey={key} stackId="a" cornerRadius={5} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} className="stroke-transparent stroke-2" />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </ItemContent>
      <ItemFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {t('actions.by.user')} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">{t('showing.total.actions')}</div>
      </ItemFooter>
    </>
  );
}

interface UsersChartProps {
  filters: TrackingFilters;
}
