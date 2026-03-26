import { useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import DefaultEmptyData from '@/components/default-empty-data';
import IconPatients from '@/components/icons/Patients.Icon';
import IconTrendingDown from '@/components/icons/TrendingDown.Icon';
import IconTrendingUp from '@/components/icons/TrendingUp.Icon';
import IconUser from '@/components/icons/User.Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import type { DbPatientAnalytics, PatientDemographics, PatientPeriodChart, PatientRegistrationTrends } from '@/lib/interfaces/analytics.interface';
import { cn } from '@/lib/utils/cn.util';
import { usePatientAnalyticsQuery } from '@/query/analytics';

function CustomTooltip({ active, payload, label, labelFormatter }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0];
  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <span className="block text-[0.70rem] text-muted-foreground">{formattedLabel}</span>
      <span className="font-semibold text-muted-foreground">{data.value} cadastros</span>
    </div>
  );
}

function LineChartCard({
  data,
  labelFormatter,
  strokeColor = 'var(--muted-foreground)',
}: {
  data: Array<{ [key: string]: any }>;
  labelFormatter?: (label: string) => string;
  strokeColor?: string;
}) {
  const config: ChartConfig = {
    cadastros: { label: 'Cadastros', color: strokeColor },
  };

  return (
    <ChartContainer className="h-full w-full" config={config}>
      <LineChart data={data} margin={{ top: 6, bottom: 0, right: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={Object.keys(data[0] || {})[0]} tickLine={false} axisLine={false} tickMargin={8} className="text-[11px]" />
        <ChartTooltip content={<CustomTooltip labelFormatter={labelFormatter} />} cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Line type="monotone" dataKey="cadastros" stroke={strokeColor} strokeWidth={4} dot={false} activeDot={{ r: 4, stroke: strokeColor }} />
      </LineChart>
    </ChartContainer>
  );
}

function PatientPeriodChartCard({ chartData }: { chartData: PatientPeriodChart }) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('90d');
  const dataMap = {
    '7d': chartData.last7Days,
    '30d': chartData.last30Days,
    '90d': chartData.last90Days,
  };
  const currentData = dataMap[timeRange];
  const data = currentData.map((item) => ({ dia: item.day, cadastros: item.amount }));

  return (
    <ItemContent className="h-full space-y-4 pb-2">
      <div className="flex flex-row items-center justify-between space-y-0">
        <ItemTitle>Histórico de Cadastros</ItemTitle>
        <ToggleGroup type="single" value={timeRange} variant="outline" onValueChange={(value) => value && setTimeRange(value as typeof timeRange)}>
          {Object.keys(dataMap).map((period) => (
            <ToggleGroupItem key={period} value={period} size="sm">
              {period}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {currentData.length > 0 ? (
        <div className="h-36 w-full">
          <LineChartCard data={data} labelFormatter={(label: string) => `Dia ${label}`} />
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUser className="size-4" />
            <p className="text-sm">Nenhum cadastro no período selecionado</p>
          </div>
        </div>
      )}
    </ItemContent>
  );
}

function RegistrationTrendsCard({ trends }: { trends: PatientRegistrationTrends }) {
  const isPositiveGrowth = trends.growthRate > 0;
  const isNegativeGrowth = trends.growthRate < 0;

  const growthColorClass = isPositiveGrowth ? 'text-green-500 dark:text-green-400' : isNegativeGrowth ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';

  const strokeColor = isPositiveGrowth ? 'hsl(142 76% 36%)' : isNegativeGrowth ? 'hsl(0 84% 60%)' : 'hsl(var(--muted-foreground))';

  const GrowthIcon = isNegativeGrowth ? IconTrendingDown : IconTrendingUp;

  const data = [
    { label: 'Há 90 dias', cadastros: trends.previous90Days },
    { label: 'Há 60 dias', cadastros: trends.previous60Days },
    { label: 'Últimos 30 dias', cadastros: trends.previous30Days },
  ];

  return (
    <ItemContent className="h-full space-y-4 pb-2">
      <ItemTitle>Novos Cadastros</ItemTitle>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col items-center">
          <span className="font-bold text-2xl tabular-nums leading-5">+{trends.previous60Days}</span>
          <p className="text-right text-muted-foreground text-sm">Mês passado</p>
        </div>
        <div className="flex flex-row items-end justify-end gap-4">
          <div className="flex flex-col items-center">
            <span className="font-bold text-2xl tabular-nums leading-5">+{trends.previous30Days}</span>
            <p className="text-right text-muted-foreground text-sm">Há 30 dias</p>
          </div>
          <div>
            <GrowthIcon className={cn('size-4 stroke-2', growthColorClass)} />
            <p className={cn('font-semibold text-sm tracking-tight', growthColorClass)}>
              {trends.growthRate > 0 ? '+' : ''}
              {trends.growthRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
      <div className="h-24 w-full">
        <LineChartCard data={data} strokeColor={strokeColor} />
      </div>
    </ItemContent>
  );
}

function PatientDemographicsCard({ demographics, total: totalPatients }: { demographics: PatientDemographics; total: number }) {
  const demographicsData = demographics && (demographics.male > 0 || demographics.female > 0);
  const percentageData = demographics && typeof demographics.malePercentage === 'number' && typeof demographics.femalePercentage === 'number';

  return (
    <ItemContent className="h-full space-y-4 pb-2">
      <div className="flex flex-row items-center justify-between space-y-0">
        <p className="font-medium text-sm">Total de Pacientes</p>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconPatients className="size-4" />
          <p className="tabular-nums tracking-tight">{totalPatients} registrados</p>
        </div>
      </div>

      {demographicsData ? (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Masculino</p>
              <p className="font-medium text-sm">{demographics.male} pacientes</p>
            </div>
            <div className="relative">
              <div className="h-8 overflow-hidden rounded-md bg-muted">
                <div
                  className="flex h-full items-center justify-end bg-gradient-to-r from-blue-400 to-blue-600 pr-3 transition-all duration-700 ease-out hover:from-blue-500 hover:to-blue-700"
                  style={{
                    width: `${percentageData ? demographics.malePercentage : (demographics.male / totalPatients) * 100}%`,
                  }}
                >
                  <span className="font-semibold text-white text-xs">{percentageData && `${demographics.malePercentage.toFixed(1)}%`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">Feminino</p>
              <p className="font-medium text-sm">{demographics.female} pacientes</p>
            </div>
            <div className="relative">
              <div className="h-8 overflow-hidden rounded-md bg-muted">
                <div
                  className="flex h-full items-center justify-end bg-gradient-to-r from-pink-400 to-pink-600 pr-3 transition-all duration-700 ease-out hover:from-pink-500 hover:to-pink-700"
                  style={{
                    width: `${percentageData ? demographics.femalePercentage : (demographics.female / totalPatients) * 100}%`,
                  }}
                >
                  <span className="font-semibold text-white text-xs">{percentageData && `${demographics.femalePercentage.toFixed(1)}%`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUser className="size-4" />
            <p className="text-sm">{totalPatients > 0 ? 'Dados demográficos não disponíveis' : 'Nenhum paciente cadastrado'}</p>
          </div>
        </div>
      )}
    </ItemContent>
  );
}

function AnalyticsCards({ analytics }: { analytics: DbPatientAnalytics }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Item variant="outline" className="md:col-span-2 lg:col-span-1">
          <PatientPeriodChartCard chartData={analytics.periodChart} />
        </Item>
        <Item variant="outline">
          <RegistrationTrendsCard trends={analytics.registrationTrends} />
        </Item>
        <Item variant="outline">
          <PatientDemographicsCard demographics={analytics.demographics} total={analytics.totalPatients} />
        </Item>
      </div>
      <div className="flex items-baseline justify-end gap-2">
        <ItemDescription>Última atualização:</ItemDescription>
        <ItemTitle>{formatDate(analytics.updatedAt)}</ItemTitle>
      </div>
    </div>
  );
}

export default function PatientAnalytics() {
  const [opened, setOpened] = useState(false);
  const { data: analytics, isLoading } = usePatientAnalyticsQuery({ enabled: opened });

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      onValueChange={(value) => {
        if (value) setOpened(true);
      }}
    >
      <AccordionItem value="analytics">
        <AccordionTrigger className="hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden">
          <ItemTitle className="underline decoration-dashed underline-offset-4">Análises de Pacientes</ItemTitle>
        </AccordionTrigger>
        <AccordionContent>
          {isLoading && <div className="mb-4 text-muted-foreground text-xs italic">Sincronizando estatísticas em tempo real...</div>}
          {analytics && <AnalyticsCards analytics={analytics} />}
          {!isLoading && !analytics && <DefaultEmptyData />}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
