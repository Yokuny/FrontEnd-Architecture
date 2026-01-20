import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_MIN_HEIGHT, CURRENCY_CONFIG, DATE_FORMATS, STATUS_COLORS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

export function RevenueChart({ data, isLoading, totalRevenue, totalLoss }: RevenueChartProps) {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce(
      (acc, curr) => {
        const dateKey = format(new Date(curr.date), DATE_FORMATS.CHART_DAY);
        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            revenue: 0,
            loss: 0,
            fullDate: curr.date,
          };
        }

        if (curr.status === 'operacao') {
          acc[dateKey].revenue += (curr.totalHours * 100) / 24;
        } else if (curr.status === 'downtime' || curr.status === 'downtime-parcial') {
          acc[dateKey].loss -= (curr.totalHours * 100) / 24;
        }

        return acc;
      },
      {} as Record<string, { date: string; revenue: number; loss: number; fullDate: number }>,
    );

    // Flatten to a list of bars (each day can have two bars: one positive, one negative)
    const result: any[] = [];
    Object.values(grouped).forEach((day) => {
      if (day.revenue > 0) {
        result.push({
          date: day.date,
          value: parseFloat(day.revenue.toFixed(2)),
          type: 'revenue',
        });
      }
      if (day.loss < 0) {
        result.push({
          date: day.date,
          value: parseFloat(day.loss.toFixed(2)),
          type: 'loss',
        });
      }
    });

    return result;
  }, [data]);

  const chartConfig = {
    value: {
      label: t('value'),
    },
  };

  if (isLoading) return <Skeleton className="w-full" style={{ height: CHART_MIN_HEIGHT.DEFAULT }} />;

  const currencyFormatter = new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CODE,
  });

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="text-lg">
          {t('revenue')} x {t('loss')}
        </ItemTitle>
        <ItemTitle className="text-lg">
          <div className="flex items-center gap-1.5">
            <ItemTitle>{t('revenue')}:</ItemTitle>
            <ItemContent className="font-bold text-lime-700">{currencyFormatter.format(totalRevenue || 0)}</ItemContent>
          </div>
          <div className="flex items-center gap-1.5">
            <ItemTitle>{t('loss')}:</ItemTitle>
            <ItemContent className="font-bold text-rose-700">{currencyFormatter.format(totalLoss || 0)}</ItemContent>
          </div>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} style={{ minHeight: CHART_MIN_HEIGHT.DEFAULT }} className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[-100, 100]}
                  fontSize={12}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      formatter={(value, _name, item) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: item.payload.type === 'revenue' ? STATUS_COLORS.operacao : STATUS_COLORS.downtime }} />
                            <span className="font-medium">{item.payload.type === 'revenue' ? t('revenue') : t('loss')}:</span>
                            <span className="font-bold">{value}%</span>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.type}-${index}`} fill={entry.type === 'revenue' ? STATUS_COLORS.operacao : STATUS_COLORS.downtime} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface RevenueChartProps {
  data: StatusDataItem[];
  isLoading?: boolean;
  totalRevenue?: number;
  totalLoss?: number;
}
