'use client';

// extraido de https://rosencharts.com/

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';

export const description = 'A donut chart with text and legend';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-hue-red)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-hue-blue)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-hue-orange)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-hue-cyan)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-ui-hard)' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--color-hue-red)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--color-hue-blue)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--color-hue-orange)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--color-hue-cyan)',
  },
  other: {
    label: 'Other',
    color: 'var(--color-ui-hard)',
  },
} satisfies ChartConfig;

export function GraphPizza() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Item variant="outline" className="flex-col items-stretch">
      <ItemHeader className="items-center flex-col">
        <ItemTitle>Pie Chart - Donut with Text</ItemTitle>
        <ItemDescription>Description</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <ChartContainer config={chartConfig} className="max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="browser" />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
          </PieChart>
        </ChartContainer>
      </ItemContent>
    </Item>
  );
}
