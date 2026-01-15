import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrackingUserAccessDay } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT } from '../@consts';
import type { TrackingFilters, UserAccessDayData } from '../@interface';

export function UserAccessDayChart({ filters }: UserAccessDayChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUserAccessDay(filters);
  const data = rawData as UserAccessDayData | undefined;

  const filterDateSize = useMemo(() => {
    if (!data) return 10;
    if (data.usersDay.length > 60 || data.usersDayWhatsapp.length > 60) {
      return 7; // YEAR_MONTH_SLICE
    }
    return 10; // YEAR_MONTH_DAY_SLICE
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];

    const days = [
      ...new Set([...(data.usersDay?.map((x) => x.date.slice(0, filterDateSize)) || []), ...(data.usersDayWhatsapp?.map((x) => x.date.slice(0, filterDateSize)) || [])]),
    ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return days.map((dateStr) => {
      const systemTotal = data.usersDay?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;

      const whatsappTotal = data.usersDayWhatsapp?.filter((x) => x.date.slice(0, filterDateSize) === dateStr).reduce((sum, item) => sum + item.total, 0) || 0;

      return {
        key: dateStr,
        date: format(parseISO(dateStr.length === 7 ? `${dateStr}-01` : dateStr), filterDateSize === 10 ? 'dd/MM' : 'MM/yyyy'),
        system: systemTotal,
        whatsapp: whatsappTotal,
      };
    });
  }, [data, filterDateSize]);

  const totals = useMemo(() => {
    if (!data) return { system: 0, whatsapp: 0 };
    return {
      system: data.usersDay?.reduce((sum, x) => sum + x.total, 0) || 0,
      whatsapp: data.usersDayWhatsapp?.reduce((sum, x) => sum + x.total, 0) || 0,
    };
  }, [data]);

  const chartConfig = {
    system: {
      label: t('system'),
      color: 'var(--color-hue-blue)',
    },
    whatsapp: {
      label: 'WhatsApp',
      color: 'var(--color-hue-green)',
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT} w-full`} />;

  return (
    <Item variant="outline" className="flex-col items-stretch w-full">
      <ItemHeader className="flex-col items-start gap-1 mb-6">
        <ItemTitle className="text-xl font-semibold">{t('users')}</ItemTitle>
        <ItemDescription>{t('tracking.activity.users.description', 'Atividades de acesso de usuários ao sistema e aplicativos')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ChartContainer config={chartConfig} className={`${CHART_HEIGHT} w-full`}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="system" stackId="a" fill="var(--color-hue-blue)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="whatsapp" stackId="a" fill="var(--color-hue-green)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="flex gap-4 mt-8">
          <div className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-hue-blue" />
              <span className="text-xs font-medium text-muted-foreground uppercase">{t('system')}</span>
            </div>
            <div className="mt-1 text-2xl font-bold">{totals.system}</div>
          </div>
          <div className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-hue-green" />
              <span className="text-xs font-medium text-muted-foreground uppercase">WhatsApp</span>
            </div>
            <div className="mt-1 text-2xl font-bold">{totals.whatsapp}</div>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}

interface UserAccessDayChartProps {
  filters: TrackingFilters;
}
