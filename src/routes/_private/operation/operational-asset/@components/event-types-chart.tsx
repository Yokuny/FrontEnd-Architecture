import { ChevronLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_MIN_HEIGHT } from '../@consts/operational-asset.constants';
import type { RawChartData } from '../@services/operational-asset.service';

export function EventTypesChart({ data, isLoading }: EventTypesChartProps) {
  const { t } = useTranslation();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { chartData, totalEvents: _totalEvents } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], totalEvents: 0 };

    const filteredData = selectedGroup ? data.filter((x) => x.group === selectedGroup) : data;

    const keyField = selectedGroup ? 'subgroup' : 'group';
    const grouped = filteredData.reduce(
      (acc, curr) => {
        const key = curr[keyField] || 'N/A';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);

    const result = Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value * 100) / total).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    return { chartData: result, totalEvents: total };
  }, [data, selectedGroup]);

  const chartConfig = {
    value: {
      label: t('total'),
    },
  };

  if (isLoading) return <Skeleton className="w-full" style={{ height: CHART_MIN_HEIGHT.LARGE }} />;

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <div className="flex items-center gap-2">
          {selectedGroup && (
            <Button onClick={() => setSelectedGroup(null)} title={t('back')}>
              <ChevronLeft className="size-4" />
            </Button>
          )}
          <ItemTitle className="text-lg">{selectedGroup ? `${t('group')}: ${selectedGroup}` : t('group')}</ItemTitle>
        </div>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} style={{ minHeight: CHART_MIN_HEIGHT.LARGE }} className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                onClick={(state) => {
                  if (!selectedGroup && state?.activeLabel) {
                    setSelectedGroup(state.activeLabel);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis type="number" hide domain={[0, 'auto']} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={120} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      formatter={(value, _name, item) => (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <ItemTitle className="font-bold text-xs">{item.payload.name}:</ItemTitle>
                            <ItemContent className="font-bold text-xs">{value}</ItemContent>
                          </div>
                          <div className="ml-4 flex items-baseline gap-1">
                            <ItemTitle className="text-[10px] text-muted-foreground">{t('percentage')}:</ItemTitle>
                            <ItemContent className="font-medium text-[10px] text-muted-foreground">{item.payload.percentage}%</ItemContent>
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} cursor={!selectedGroup ? 'pointer' : 'default'}>
                  {chartData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={getChartColor(index)} />
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

interface EventTypesChartProps {
  data: RawChartData[];
  isLoading?: boolean;
}
