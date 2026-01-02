'use client';

import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

const data = [
  {
    name: 'Dashboards',
    capacity: 10,
    current: 2,
    allowed: 20,
    fill: 'var(--chart-2)',
  },
  {
    name: 'Storage',
    capacity: 50,
    current: 25,
    allowed: 100,
    fill: 'var(--chart-4)',
  },
];

const chartConfig = {
  capacity: {
    label: 'Capacity',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function Stats07() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <Item key={item.name} variant="outline" className="items-center">
          <ItemMedia className="relative flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-[80px] w-[80px]">
              <RadialBarChart data={[item]} innerRadius={30} outerRadius={60} barSize={6} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} axisLine={false} />
                <RadialBar dataKey="capacity" background cornerRadius={10} fill="var(--primary)" angleAxisId={0} />
              </RadialBarChart>
            </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-medium text-foreground">{item.capacity}%</span>
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{item.name}</ItemTitle>
            <ItemDescription>
              {item.current} of {item.allowed} used
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
