import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

interface CMMSChartsProps {
  cmmsData: any[] | undefined;
  isLoading: boolean;
}

export function CMMSCharts({ cmmsData, isLoading }: CMMSChartsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <ItemGroup className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </ItemGroup>
    );
  }

  if (!cmmsData || cmmsData.length === 0) return null;

  const osOpen = cmmsData.filter((x) => !x.dataConclusao);
  const osClosed = cmmsData.filter((x) => !!x.dataConclusao);
  const osExpired = cmmsData.filter((x) => x.manutencaoVencida === 'Sim' || x.tipoManutencao === t('corrective_from_predictive'));

  const statusData = [
    { name: t('open'), value: osOpen.length, fill: getChartColor(2) }, // Warning color
    { name: t('closed'), value: osClosed.length, fill: getChartColor(1) }, // Success color
  ];

  const deviationsData = [
    { name: t('deviation.open'), value: osExpired.filter((x) => !x.dataConclusao).length, fill: getChartColor(0) }, // Danger color
    { name: t('deviation.executed'), value: osExpired.filter((x) => !!x.dataConclusao).length, fill: getChartColor(1) }, // Success color
  ];

  return (
    <ItemGroup className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tasks Open vs Closed */}
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>{t('tasks.open_vs_closed')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="h-64">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ItemContent>
      </Item>

      {/* Deviations */}
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>{t('predictive_deviations')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="h-64">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviationsData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deviationsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ItemContent>
      </Item>

      {/* Reliability (Simplified) */}
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>{t('reliability')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="h-64">
          {/* Placeholder for reliability bar chart or similar if needed */}
          <div className="flex h-full items-center justify-center text-muted-foreground italic">{t('reliability.chart.placeholder')}</div>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
