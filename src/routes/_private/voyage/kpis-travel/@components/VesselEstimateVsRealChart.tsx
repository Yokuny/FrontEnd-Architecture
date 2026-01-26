import { useTranslation } from 'react-i18next';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';

interface VesselEstimateVsRealChartProps {
  data: any[];
}

export function VesselEstimateVsRealChart({ data }: VesselEstimateVsRealChartProps) {
  const { t } = useTranslation();

  const vessels = [...new Set(data.map((x) => x.machine?.name).filter(Boolean))];

  const chartConfig = {
    estimated: {
      label: t('estimated'),
      color: getChartColor(0), // Slate/Grey as per legacy colorBasic400
    },
    real: {
      label: t('real'),
      color: getChartColor(1), // Blue
    },
    count: {
      label: t('list.travel'),
      color: getChartColor(14), // Success/Green
    },
  } satisfies ChartConfig;

  const chartData = vessels.map((vessel) => {
    const vesselData = data.filter((x) => x.machine?.name === vessel);
    return {
      vessel,
      estimated: vesselData.reduce((acc, curr) => acc + (curr.calculated?.estimatedTotal || 0), 0),
      real: vesselData.reduce((acc, curr) => acc + (curr.calculated?.realTotal || 0), 0),
      count: vesselData.length,
    };
  });

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle className="font-medium text-muted-foreground">
          {t('vessel')} ({t('estimated')} x {t('real')})
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
            <XAxis dataKey="vessel" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: t('day.unity'), angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: t('list.travel'), angle: 90, position: 'insideRight', style: { fill: 'var(--muted-foreground)' } }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar yAxisId="left" dataKey="estimated" fill="var(--color-estimated)" radius={[4, 4, 0, 0]} barSize={35} />
            <Bar yAxisId="left" dataKey="real" fill="var(--color-real)" radius={[4, 4, 0, 0]} barSize={35} />
            <Line yAxisId="right" type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}
