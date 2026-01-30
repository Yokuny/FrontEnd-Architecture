import { useTranslation } from 'react-i18next';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';

interface VoyageEstimateVsRealChartProps {
  data: any[];
}

export function VoyageEstimateVsRealChart({ data }: VoyageEstimateVsRealChartProps) {
  const { t } = useTranslation();

  const chartConfig = {
    estimated: {
      label: t('estimated'),
      color: getChartColor(10), // Amber
    },
    real: {
      label: t('real'),
      color: getChartColor(1), // Blue
    },
    goal: {
      label: t('goal'),
      color: getChartColor(8), // Red
    },
  } satisfies ChartConfig;

  const chartData = data.map((item) => ({
    code: item.code,
    estimated: item.calculated?.estimatedTotal || 0,
    real: item.calculated?.realTotal || 0,
    goal: item.goal || 0,
  }));

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="font-medium text-muted-foreground">
          {t('travel')} ({t('estimated')} x {t('real')})
        </ItemTitle>
      </ItemHeader>
      <ItemContent className="h-96">
        <ChartContainer config={chartConfig}>
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="code" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: t('day.unity'), angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)' } }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="estimated" fill="var(--color-estimated)" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="real" fill="var(--color-real)" radius={[4, 4, 0, 0]} barSize={40} />
            <Line type="monotone" dataKey="goal" stroke="var(--color-goal)" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}
