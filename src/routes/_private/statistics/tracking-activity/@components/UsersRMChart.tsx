import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, Treemap } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUsersRM } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE, DEVICE_COLORS, TOP_USER_LIMIT } from '../@consts';
import type { TrackingFilters, TrackingUserData } from '../@interface';

export function UsersRMChart({ filters }: UsersRMChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUsersRM(filters);
  const data = rawData as TrackingUserData[] | undefined;

  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const sortedData = [...data].sort((a, b) => b.total - a.total);
    return sortedData.slice(0, TOP_USER_LIMIT).map((item) => ({
      name: item.user || t('unknown'),
      value: item.total,
    }));
  }, [data, t]);

  const chartConfig = {
    value: {
      label: t('actions'),
      color: DEVICE_COLORS[2] || DEVICE_COLORS[0],
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  const isEmpty = !data || data.length === 0;

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="mb-6 flex-col items-start gap-1">
        <ItemTitle className="font-semibold text-xl">{t('users')} RM</ItemTitle>
        <ItemDescription>{t('tracking.activity.users.rm.description', 'Distribuição de atividades RM por usuário')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} className={`${CHART_HEIGHT_LARGE} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap data={chartData} dataKey="value" aspectRatio={4 / 3} stroke="#fff" fill={DEVICE_COLORS[2] || DEVICE_COLORS[0]}>
                <ChartTooltip content={<ChartTooltipContent />} />
              </Treemap>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface UsersRMChartProps {
  filters: TrackingFilters;
}
