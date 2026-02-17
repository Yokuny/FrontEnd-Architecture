import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import type { IVisualization } from '../@interface/ai-search.interface';

/**
 * Transforma IVisualization em dados compatíveis com Recharts
 */
function transformToRechartsData(viz: IVisualization) {
  return viz.labels.map((label, idx) => {
    const point: Record<string, string | number> = { label };
    for (const dataset of viz.datasets) {
      point[dataset.label] = dataset.data[idx] ?? 0;
    }
    return point;
  });
}

/**
 * Gera ChartConfig dinâmico com base nos datasets
 */
function buildChartConfig(viz: IVisualization): ChartConfig {
  const config: ChartConfig = {};
  for (const [idx, dataset] of viz.datasets.entries()) {
    config[dataset.label] = {
      label: dataset.label,
      color: dataset.color || getChartColor(idx),
    };
  }
  return config;
}

/**
 * Gera ChartConfig para PieChart
 */
function buildPieConfig(viz: IVisualization): ChartConfig {
  const config: ChartConfig = {
    value: { label: viz.datasets[0]?.label || 'Valor' },
  };
  for (const [idx, label] of viz.labels.entries()) {
    config[label] = {
      label,
      color: getChartColor(idx),
    };
  }
  return config;
}

// --- Chart Components ---

function AIBarChart({ viz }: { viz: IVisualization }) {
  const data = useMemo(() => transformToRechartsData(viz), [viz]);
  const config = useMemo(() => buildChartConfig(viz), [viz]);
  const isStacked = viz.options?.stacked;

  return (
    <ChartContainer config={config}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
        {viz.options?.yAxisLabel && <YAxis label={{ value: viz.options.yAxisLabel, angle: -90, position: 'insideLeft' }} />}
        <ChartTooltip content={<ChartTooltipContent />} />
        {viz.options?.showLegend !== false && viz.datasets.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {viz.datasets.map((dataset, idx) => (
          <Bar
            key={dataset.label}
            dataKey={dataset.label}
            fill={dataset.color || getChartColor(idx)}
            stackId={isStacked ? 'stack' : undefined}
            radius={isStacked ? (idx === viz.datasets.length - 1 ? [4, 4, 0, 0] : idx === 0 ? [0, 0, 4, 4] : 0) : [4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

function AILineChart({ viz }: { viz: IVisualization }) {
  const data = useMemo(() => transformToRechartsData(viz), [viz]);
  const config = useMemo(() => buildChartConfig(viz), [viz]);

  return (
    <ChartContainer config={config}>
      <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {viz.options?.showLegend !== false && viz.datasets.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {viz.datasets.map((dataset, idx) => (
          <Line key={dataset.label} dataKey={dataset.label} type="monotone" stroke={dataset.color || getChartColor(idx)} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

function AIAreaChart({ viz }: { viz: IVisualization }) {
  const data = useMemo(() => transformToRechartsData(viz), [viz]);
  const config = useMemo(() => buildChartConfig(viz), [viz]);

  return (
    <ChartContainer config={config}>
      <AreaChart data={data}>
        <defs>
          {viz.datasets.map((dataset, idx) => {
            const color = dataset.color || getChartColor(idx);
            const gradientId = `ai-area-gradient-${idx}`;
            return (
              <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {viz.options?.showLegend !== false && viz.datasets.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
        {viz.datasets.map((dataset, idx) => (
          <Area
            key={dataset.label}
            dataKey={dataset.label}
            stroke={dataset.color || getChartColor(idx)}
            fill={`url(#ai-area-gradient-${idx})`}
            fillOpacity={0.4}
            strokeWidth={1.5}
            type="monotone"
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

function AIPieChart({ viz, isDoughnut }: { viz: IVisualization; isDoughnut?: boolean }) {
  const data = useMemo(() => {
    return viz.labels.map((label, idx) => ({
      name: label,
      value: viz.datasets[0]?.data[idx] ?? 0,
      fill: getChartColor(idx),
    }));
  }, [viz]);

  const config = useMemo(() => buildPieConfig(viz), [viz]);
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  return (
    <ChartContainer config={config} className="aspect-square max-h-64">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={isDoughnut ? 50 : 0} strokeWidth={isDoughnut ? 5 : 2}>
          {isDoughnut && (
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-2xl">
                        {total.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
                        {viz.options?.unit || 'Total'}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          )}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center" />
      </PieChart>
    </ChartContainer>
  );
}

function AIRadarChart({ viz }: { viz: IVisualization }) {
  const data = useMemo(() => transformToRechartsData(viz), [viz]);
  const config = useMemo(() => buildChartConfig(viz), [viz]);

  return (
    <ChartContainer config={config} className="aspect-square max-h-64">
      <RadarChart data={data}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="label" />
        <PolarGrid />
        {viz.datasets.map((dataset, idx) => (
          <Radar
            key={dataset.label}
            dataKey={dataset.label}
            fill={dataset.color || getChartColor(idx)}
            fillOpacity={0.3}
            stroke={dataset.color || getChartColor(idx)}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ChartContainer>
  );
}

function AIGaugeChart({ viz }: { viz: IVisualization }) {
  const value = viz.datasets[0]?.data[0] ?? 0;
  const maxValue = viz.datasets[0]?.data[1] ?? 100;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const endAngle = (percentage / 100) * 360;

  const gaugeData = [{ name: viz.labels[0] || 'value', value, fill: viz.datasets[0]?.color || getChartColor(0) }];
  const config: ChartConfig = {
    value: { label: viz.labels[0] || 'Valor', color: viz.datasets[0]?.color || getChartColor(0) },
  };

  return (
    <ChartContainer config={config} className="max-h-[200px]">
      <RadialBarChart data={gaugeData} endAngle={endAngle} innerRadius={70} outerRadius={110}>
        <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[76, 64]} />
        <RadialBar dataKey="value" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground font-bold text-3xl">
                      {value.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} className="fill-muted-foreground text-xs">
                      {viz.options?.unit || viz.labels[0] || ''}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

// --- Main Renderer ---

interface AIVisualizationProps {
  visualization: IVisualization;
}

export function AIVisualization({ visualization }: AIVisualizationProps) {
  const renderChart = () => {
    switch (visualization.chartType) {
      case 'bar':
        return <AIBarChart viz={visualization} />;
      case 'line':
        return <AILineChart viz={visualization} />;
      case 'area':
        return <AIAreaChart viz={visualization} />;
      case 'pie':
        return <AIPieChart viz={visualization} />;
      case 'doughnut':
        return <AIPieChart viz={visualization} isDoughnut />;
      case 'radar':
        return <AIRadarChart viz={visualization} />;
      case 'gauge':
        return <AIGaugeChart viz={visualization} />;
      case 'scatter':
        return <AILineChart viz={visualization} />;
      default:
        return null;
    }
  };

  return (
    <Item variant="outline" className="flex-col items-stretch">
      <ItemHeader className="flex-col items-center justify-center">
        <ItemTitle className="text-xs">{visualization.title}</ItemTitle>
        {visualization.options?.xAxisLabel && <ItemDescription className="text-xs">{visualization.options.xAxisLabel}</ItemDescription>}
      </ItemHeader>
      <ItemContent>{renderChart()}</ItemContent>
    </Item>
  );
}

interface AIVisualizationListProps {
  visualizations: IVisualization[];
}

export function AIVisualizationList({ visualizations }: AIVisualizationListProps) {
  if (!visualizations || visualizations.length === 0) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      {visualizations.map((viz, idx) => (
        <AIVisualization key={`${viz.chartType}-${viz.title}-${idx}`} visualization={viz} />
      ))}
    </div>
  );
}
