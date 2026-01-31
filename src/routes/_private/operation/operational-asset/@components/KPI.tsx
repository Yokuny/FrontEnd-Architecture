import { Activity, BarChart3, Clock, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY_CONFIG, OPERATIONAL_ASSET_STATUS, STATUS_COLORS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

export function KPI({ data, totalLoss, totalRevenue, viewFinancial }: MiniDashboardsProps) {
  const { t } = useTranslation();

  const totalHours = data.reduce((acc, curr) => acc + curr.totalHours, 0);
  const operationalHours = data.filter((d) => d.status === OPERATIONAL_ASSET_STATUS.OPERACAO).reduce((acc, curr) => acc + curr.totalHours, 0);
  const downtimeHours = data
    .filter((d) => d.status === OPERATIONAL_ASSET_STATUS.DOWNTIME || d.status === OPERATIONAL_ASSET_STATUS.DOWNTIME_PARCIAL)
    .reduce((acc, curr) => acc + curr.totalHours, 0);

  const operabilityRate = totalHours > 0 ? (operationalHours * 100) / totalHours : 0;
  const avgDailyOperational = data.length > 0 ? operationalHours / (totalHours / 24) : 0;

  const currencyFormatter = new Intl.NumberFormat(CURRENCY_CONFIG.LOCALE, {
    style: 'currency',
    currency: CURRENCY_CONFIG.CODE,
  });

  const { breakdownData } = useMemo(() => {
    if (!data || data.length === 0) return { breakdownData: [] };

    const grouped = data.reduce(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + curr.totalHours;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedEntries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    const total = sortedEntries.reduce((acc, [, val]) => acc + val, 0);

    let cumulativeWidth = 0;
    const items = sortedEntries.map(([status, value], index) => {
      const width = (value / total) * 100;
      const left = cumulativeWidth;
      cumulativeWidth += width;

      const cornerRadius = 6;
      let borderRadius = '0';
      if (index === 0) {
        borderRadius = `${cornerRadius}px 0 0 ${cornerRadius}px`;
      } else if (index === sortedEntries.length - 1) {
        borderRadius = `0 ${cornerRadius}px ${cornerRadius}px 0`;
      }

      return {
        status,
        label: t(status),
        value,
        percentage: width.toFixed(1),
        width,
        left,
        borderRadius,
        color: STATUS_COLORS[status] || '#94a3b8',
      };
    });

    return { breakdownData: items };
  }, [data, t]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <Clock className="size-5" />
            <ItemDescription className="font-medium">{t('time.operational')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{operationalHours.toFixed(1)}h</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <TriangleAlert className="size-5" />
            <ItemDescription className="font-medium">{t('time.inoperability')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{downtimeHours.toFixed(1)}h</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <Activity className="size-5" />
            <ItemDescription className="font-medium">{t('operating.rate')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{operabilityRate.toFixed(1)}%</ItemTitle>
        </Item>

        <Item className="flex-col rounded-none border-0 bg-background">
          <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
            <BarChart3 className="size-5" />
            <ItemDescription className="font-medium">{t('avg.daily.operational')}</ItemDescription>
          </ItemContent>
          <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{avgDailyOperational.toFixed(1)}h</ItemTitle>
        </Item>
      </div>

      {viewFinancial && (
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
          <Item className="flex-col rounded-none border-0 bg-background">
            <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
              <TrendingUp className="size-5 text-emerald-600" />
              <ItemDescription className="font-medium">{t('revenue')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="ml-6 font-bold text-emerald-600 text-xl tracking-tight">{currencyFormatter.format(totalRevenue)}</ItemTitle>
          </Item>
          <Item className="flex-col rounded-none border-0 bg-background">
            <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
              <TrendingDown className="size-5 text-rose-600" />
              <ItemDescription className="font-medium">{t('loss')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="ml-6 font-bold text-rose-600 text-xl tracking-tight">{currencyFormatter.format(totalLoss)}</ItemTitle>
          </Item>
        </div>
      )}

      <Item variant="outline" className="flex-1">
        <ItemDescription className="font-medium">{t('last.status')}</ItemDescription>
        <div className="relative flex h-8 w-full items-center overflow-hidden rounded-md bg-muted">
          <TooltipProvider>
            {breakdownData.map((d, index) => (
              <Tooltip key={`${d.status}-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute flex h-full cursor-help items-center justify-center overflow-hidden transition-all duration-300 hover:brightness-110"
                    style={{
                      width: `${d.width}%`,
                      left: `${d.left}%`,
                      backgroundColor: d.color,
                      borderRadius: d.borderRadius,
                    }}
                  >
                    {d.width > 15 && <span className="truncate px-1 font-bold text-[10px] text-white">{d.percentage}%</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex min-w-32 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="size-3" style={{ backgroundColor: d.color }} />
                    <ItemTitle className="font-medium uppercase tracking-tight">{d.label}</ItemTitle>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <ItemTitle className="font-black text-lg tabular-nums">{d.value.toFixed(1)}</ItemTitle>
                    <ItemDescription className="font-normal text-xs uppercase">horas</ItemDescription>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </Item>
    </div>
  );
}

interface MiniDashboardsProps {
  data: StatusDataItem[];
  totalLoss: number;
  totalRevenue: number;
  viewFinancial: boolean;
}
