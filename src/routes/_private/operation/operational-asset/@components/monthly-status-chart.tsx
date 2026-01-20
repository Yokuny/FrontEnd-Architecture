import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { CHART_MIN_HEIGHT, STATUS_COLORS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

const STATUS_IN_OPERATION = ['operacao', 'downtime-parcial', 'dockage', 'parada-programada'];
const STATUS_NOT_IN_OPERATION = ['downtime', 'downtime-parcial', 'dockage', 'parada-programada'];

export function MonthlyStatusChart({ data, isLoading, viewFinancial }: MonthlyStatusChartProps) {
  const { t } = useTranslation();
  const [typeView, setTypeView] = useState<'competence' | 'month'>('competence');

  const { chartData, allStatuses, average } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], allStatuses: [], average: 0 };

    const monthsDistinct = [...new Set(data.map((x) => x[typeView]))];

    const formattedData = monthsDistinct.map((m) => {
      const row: any = { [typeView]: m };
      const dataInPeriod = data.filter((x) => x[typeView] === m);

      if (viewFinancial) {
        // In financial view, we show all statuses separately using totalGrossHours
        const statuses = ['operacao', 'downtime-parcial', 'downtime', 'dockage', 'parada-programada'];
        statuses.forEach((status) => {
          const hours = dataInPeriod.filter((x) => x.status === status).reduce((acc, curr) => acc + curr.totalGrossHours, 0);
          row[status] = hours;
        });
      } else {
        // In operational view, we group them using totalHours
        row.operational = dataInPeriod.filter((x) => STATUS_IN_OPERATION.includes(x.status)).reduce((acc, curr) => acc + curr.totalHours, 0);
        row.inoperability = dataInPeriod.filter((x) => x.status === 'downtime').reduce((acc, curr) => acc + curr.totalHours, 0);
      }

      // Calculate percentage for 100% stacked bar
      const keys = viewFinancial ? ['operacao', 'downtime-parcial', 'downtime', 'dockage', 'parada-programada'] : ['operational', 'inoperability'];
      const total = keys.reduce((acc, k) => acc + (row[k] || 0), 0);

      if (total > 0) {
        keys.forEach((k) => {
          row[`${k}Percent`] = ((row[k] || 0) * 100) / total;
        });
      }

      return row;
    });

    const activeStatuses = viewFinancial ? ['operacao', 'downtime-parcial', 'downtime', 'dockage', 'parada-programada'] : ['operational', 'inoperability'];

    // Average calculation matching legacy
    const totalOperation = data.filter((x) => (viewFinancial ? x.status === 'operacao' : STATUS_IN_OPERATION.includes(x.status))).reduce((acc, curr) => acc + curr.totalHours, 0);

    const totalDiff = data.filter((x) => (viewFinancial ? STATUS_NOT_IN_OPERATION.includes(x.status) : x.status === 'downtime')).reduce((acc, curr) => acc + curr.totalHours, 0);

    const avg = totalOperation === 0 ? 0 : (totalOperation * 100) / (totalOperation + totalDiff);

    return { chartData: formattedData, allStatuses: activeStatuses, average: avg };
  }, [data, viewFinancial, typeView]);

  if (isLoading) return <Skeleton className="w-full" style={{ height: CHART_MIN_HEIGHT.DEFAULT }} />;

  const chartConfig = Object.fromEntries(
    allStatuses.map((status) => {
      let label = t(status);
      if (viewFinancial) {
        if (status === 'operacao') label = t('full.tax');
        else if (status === 'downtime-parcial') label = t('reduction.tax');
        else if (status === 'downtime') label = t('inoperability');
        else if (status === 'parada-programada') label = t('programmed.stoppage');
      } else {
        if (status === 'operational') label = t('operational');
        else if (status === 'inoperability') label = t('inoperability');
      }

      const colorKey = status === 'operational' ? 'operacao' : status === 'inoperability' ? 'downtime' : status;
      return [status, { label, color: STATUS_COLORS[colorKey] || '#94a3b8' }];
    }),
  );

  const isEmpty = chartData.length === 0;

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="text-lg">{t('operational.average')}</ItemTitle>
        <div className="flex bg-muted p-1 rounded-lg gap-1 h-9">
          {/* TODO: Add toggle to switch between competence and month */}
          <Toggle
            size="sm"
            pressed={typeView === 'competence'}
            onPressedChange={() => setTypeView('competence')}
            className="text-xs px-4 h-7 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            {t('competence')}
          </Toggle>
          <Toggle
            size="sm"
            pressed={typeView === 'month'}
            onPressedChange={() => setTypeView('month')}
            className="text-xs px-4 h-7 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            {t('monthly')}
          </Toggle>
        </div>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <ChartContainer config={chartConfig} style={{ minHeight: CHART_MIN_HEIGHT.DEFAULT }} className="w-full h-40">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <XAxis dataKey={typeView} axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis hide domain={[0, 100]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    formatter={(value, _name, item, index) => {
                      const status = allStatuses[index];
                      const hours = item.payload[status];
                      return (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <div
                              className="size-2"
                              style={{ backgroundColor: STATUS_COLORS[status === 'operational' ? 'operacao' : status === 'inoperability' ? 'downtime' : status] }}
                            />
                            <ItemTitle>{chartConfig[status]?.label}:</ItemTitle>
                            <ItemContent>{parseFloat(Number(value).toFixed(1))}%</ItemContent>
                          </div>
                          <div className="flex flex-col ml-4">
                            <div className="flex items-baseline gap-1">
                              <ItemTitle>{t('day.unity')}:</ItemTitle>
                              <ItemContent>{((hours || 0) / 24).toFixed(3)}</ItemContent>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <ItemTitle>HR:</ItemTitle>
                              <ItemContent>{(hours || 0).toFixed(2)}</ItemContent>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent nameKey="value" />} />
              <ReferenceLine
                y={average}
                stroke={average < 85 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                strokeDasharray="3 3"
                label={{
                  content: (props: any) => {
                    const { viewBox } = props;
                    return (
                      <g>
                        <text
                          x={viewBox.width - 100}
                          y={viewBox.y - 10}
                          fill={average < 85 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                          className="text-[10px] font-bold"
                          textAnchor="end"
                        >
                          {t('average')} {viewFinancial ? t('tax') : t('operation')}: {average.toFixed(1)}%
                        </text>
                      </g>
                    );
                  },
                }}
              />
              {allStatuses.map((status) => (
                <Bar
                  key={status}
                  dataKey={`${status}Percent`}
                  name={status}
                  stackId="a"
                  fill={STATUS_COLORS[status === 'operational' ? 'operacao' : status === 'inoperability' ? 'downtime' : status] || '#94a3b8'}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </ItemContent>
    </Item>
  );
}

interface MonthlyStatusChartProps {
  data: StatusDataItem[];
  isLoading?: boolean;
  viewFinancial?: boolean;
}
