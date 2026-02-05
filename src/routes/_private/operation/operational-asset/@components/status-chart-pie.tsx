import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_MIN_HEIGHT, STATUS_COLORS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

export function StatusChartPie({ data, isLoading }: StatusChartPieProps) {
  const { t } = useTranslation();

  if (isLoading) return <Skeleton className="w-full" style={{ height: CHART_MIN_HEIGHT.DEFAULT }} />;

  const chartData = Object.entries(
    data.reduce(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + curr.totalHours;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([status, value]) => ({
    name: t(status),
    value,
    status,
    fill: STATUS_COLORS[status] || '#94a3b8',
  }));

  const chartConfig = {
    value: {
      label: t('hours'),
    },
    ...Object.fromEntries(chartData.map((item) => [item.status, { label: item.name, color: item.fill }])),
  };

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="text-lg">{t('last.status')}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} style={{ minHeight: CHART_MIN_HEIGHT.DEFAULT }} className="h-40 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} paddingAngle={2}>
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.status}${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface StatusChartPieProps {
  data: StatusDataItem[];
  isLoading?: boolean;
}
