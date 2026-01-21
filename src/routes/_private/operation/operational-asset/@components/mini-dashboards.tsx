import { Activity, BarChart3, Clock, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY_CONFIG, OPERATIONAL_ASSET_STATUS, STATUS_COLORS } from '../@consts/operational-asset.constants';
import type { StatusDataItem } from '../@services/operational-asset.service';

export function MiniDashboards({ data, totalLoss, totalRevenue, viewFinancial }: MiniDashboardsProps) {
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
    <div className="flex justify-between gap-4 w-full flex-wrap">
      <Item variant="outline" className="border-l-4 border-l-emerald-500 min-w-[200px] flex-col flex-1">
        <ItemContent className="flex flex-row items-center gap-2">
          <Clock className="size-5 text-emerald-500" />
          <ItemDescription className="uppercase text-xs font-bold">{t('time.operational')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-bold text-emerald-600">{operationalHours.toFixed(1)}h</ItemTitle>
      </Item>

      <Item variant="outline" className="border-l-4 border-l-red-500 min-w-[200px] flex-col flex-1">
        <ItemContent className="flex flex-row items-center gap-2">
          <TriangleAlert className="size-5 text-red-500" />
          <ItemDescription className="uppercase text-xs font-bold">{t('time.inoperability')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-bold text-red-600">{downtimeHours.toFixed(1)}h</ItemTitle>
      </Item>

      {/* OPERABILITY RATE */}
      <Item variant="outline" className="border-l-4 border-l-blue-500 min-w-[200px] flex-col flex-1">
        <ItemContent className="flex flex-row items-center gap-2">
          <Activity className="size-5 text-blue-500" />
          <ItemDescription className="uppercase text-xs font-bold">{t('operating.rate')}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex flex-col">
          <ItemTitle className="text-2xl font-bold text-blue-600">{operabilityRate.toFixed(1)}%</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="border-l-4 border-l-indigo-500 min-w-[200px] flex-col flex-1">
        <ItemContent className="flex flex-row items-center gap-2">
          <BarChart3 className="size-5 text-indigo-500" />
          <ItemDescription className="uppercase text-xs font-bold">{t('avg.daily.operational')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-bold text-indigo-600">{avgDailyOperational.toFixed(1)}h</ItemTitle>
      </Item>

      {viewFinancial && (
        <>
          <Item variant="outline" className="border-l-4 border-l-emerald-600 min-w-[200px] flex-col flex-1">
            <ItemContent className="flex flex-row items-center gap-2">
              <TrendingUp className="size-5 text-emerald-600" />
              <ItemDescription className="uppercase text-xs font-bold">{t('revenue')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="text-xl font-bold text-emerald-600">{currencyFormatter.format(totalRevenue)}</ItemTitle>
          </Item>
          <Item variant="outline" className="border-l-4 border-l-rose-600 min-w-[200px] flex-col flex-1">
            <ItemContent className="flex flex-row items-center gap-2">
              <TrendingDown className="size-5 text-rose-600" />
              <ItemDescription className="uppercase text-xs font-bold">{t('loss')}</ItemDescription>
            </ItemContent>
            <ItemTitle className="text-xl font-bold text-rose-600">{currencyFormatter.format(totalLoss)}</ItemTitle>
          </Item>
        </>
      )}

      <Item variant="outline" className="flex-1">
        <ItemDescription className="uppercase text-xs font-bold">{t('last.status')}</ItemDescription>
        <div className="relative w-full h-8 bg-muted rounded-md overflow-hidden flex items-center">
          <TooltipProvider>
            {breakdownData.map((d, index) => (
              <Tooltip key={`${d.status}-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute h-full transition-all duration-300 hover:brightness-110 cursor-help flex items-center justify-center overflow-hidden"
                    style={{
                      width: `${d.width}%`,
                      left: `${d.left}%`,
                      backgroundColor: d.color,
                      borderRadius: d.borderRadius,
                    }}
                  >
                    {d.width > 15 && <span className="text-[10px] text-white font-bold truncate px-1">{d.percentage}%</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex flex-col gap-1 min-w-32">
                  <div className="flex items-center gap-2">
                    <div className="size-3" style={{ backgroundColor: d.color }} />
                    <ItemTitle className="font-bold text-xs uppercase tracking-tight">{d.label}</ItemTitle>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <ItemTitle className="text-lg font-black tabular-nums">{d.value.toFixed(1)}</ItemTitle>
                    <ItemDescription className="text-xs font-normal uppercase">horas</ItemDescription>
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
