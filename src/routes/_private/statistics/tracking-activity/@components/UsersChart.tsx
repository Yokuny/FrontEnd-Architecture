'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTrackingUsers } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE } from '../@consts';
import type { TrackingFilters, TrackingUserData } from '../@interface';

const BREAK_COLORS = Array.from({ length: 5 }, (_, i) => getChartColor(i * 3));

export function UsersChart({ filters }: UsersChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUsers(filters);
  const data = rawData as TrackingUserData[] | undefined;

  const barHeight = 60;
  const cornerRadius = 8;

  const { processedData, totalActions } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { processedData: [], totalActions: 0 };
    }

    const sortedData = [...data].sort((a, b) => b.total - a.total);
    const topUsers = sortedData.slice(0, 5);
    const othersTotal = sortedData.slice(5).reduce((sum, item) => sum + item.total, 0);
    const totalAll = sortedData.reduce((sum, item) => sum + item.total, 0);

    let cumulativeWidth = 0;
    const bData = topUsers.map((item, index) => {
      const barWidth = (item.total / totalAll) * 100;
      const xPosition = cumulativeWidth;
      cumulativeWidth += barWidth;

      return {
        key: item.user || index.toString(),
        label: item.user || t('unknown'),
        value: item.total,
        color: BREAK_COLORS[index % BREAK_COLORS.length],
        width: barWidth,
        left: xPosition,
      };
    });

    if (othersTotal > 0) {
      const barWidth = (othersTotal / totalAll) * 100;
      const xPosition = cumulativeWidth;

      bData.push({
        key: 'others',
        label: t('others'),
        value: othersTotal,
        color: 'var(--color-slate-500)',
        width: barWidth,
        left: xPosition,
      });
    }

    // Apply specific corner rounding logic like in GraphBreakParts blueprint
    const finalData = bData.map((d, index) => {
      let borderRadius = '0';
      if (index === 0) {
        borderRadius = `${cornerRadius}px 0 0 ${cornerRadius}px`;
      } else if (index === bData.length - 1) {
        borderRadius = `0 ${cornerRadius}px ${cornerRadius}px 0`;
      }
      return { ...d, borderRadius };
    });

    return { processedData: finalData, totalActions: totalAll };
  }, [data, t]);

  if (isLoading) return <Skeleton className={`${CHART_HEIGHT_LARGE} w-full`} />;

  const isEmpty = !data || data.length === 0;

  return (
    <Item variant="outline" className="w-full flex-col items-stretch">
      <ItemHeader className="flex-col items-center">
        <ItemTitle className="font-semibold text-xl">{t('users')}</ItemTitle>
        <ItemDescription>{t('users.breakdown.description', 'Distribuição de atividades por usuário')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <>
            <div className="relative w-full" style={{ height: `${barHeight}px` }}>
              <TooltipProvider>
                {processedData.map((d, index) => (
                  <Tooltip key={`${d.key}${index}`}>
                    <TooltipTrigger asChild>
                      <div
                        className="group absolute cursor-help transition-all duration-300 hover:z-10 hover:brightness-110"
                        style={{
                          width: `${d.width}%`,
                          height: `${barHeight}px`,
                          left: `${d.left}%`,
                        }}
                      >
                        <div
                          className="h-full w-full border-white/5 border-y first:border-l last:border-r"
                          style={{
                            backgroundColor: d.color,
                            borderRadius: d.borderRadius,
                          }}
                        />

                        {d.width > 10 && (
                          <>
                            <div
                              className="pointer-events-none absolute w-full text-center font-semibold text-white"
                              style={{
                                top: `${barHeight / 5}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }}
                            >
                              <ItemDescription className="font-semibold text-white leading-none">{d.label}</ItemDescription>
                            </div>
                            <div
                              className="pointer-events-none absolute w-full text-center text-white"
                              style={{
                                top: `${barHeight * 0.45}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }}
                            >
                              <p className="font-bold font-mono text-lg text-white tabular-nums">{d.value}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="size-3" style={{ backgroundColor: d.color }} />
                        <ItemTitle className="font-bold text-xs uppercase tracking-tight">{d.label}</ItemTitle>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <ItemTitle className="font-black text-lg tabular-nums">{d.value.toLocaleString()}</ItemTitle>
                        <ItemDescription className="font-normal text-xs uppercase">{t('actions')}</ItemDescription>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            {/* Legend Pattern following GraphBreakParts Model */}
            <ItemFooter className="flex-wrap items-center justify-center gap-6 p-6">
              {processedData.map((item) => (
                <div key={item.key} className="flex flex-col items-center">
                  <div className="flex items-baseline gap-2">
                    <div className="size-2" style={{ backgroundColor: item.color }} />
                    <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{item.label}</ItemTitle>
                  </div>
                  <ItemTitle className="font-semibold text-lg tabular-nums">{item.value.toLocaleString()}</ItemTitle>
                </div>
              ))}
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2">
                  <ItemTitle className="font-semibold text-muted-foreground text-xs uppercase">{t('total')}</ItemTitle>
                  <ItemTitle className="font-semibold text-lg tabular-nums">{totalActions.toLocaleString()}</ItemTitle>
                </div>
              </div>
            </ItemFooter>
          </>
        )}
      </ItemContent>
    </Item>
  );
}

interface UsersChartProps {
  filters: TrackingFilters;
}
