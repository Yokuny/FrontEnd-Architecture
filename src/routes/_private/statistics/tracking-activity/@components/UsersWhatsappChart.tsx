'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTrackingUsersWhatsapp } from '@/hooks/use-tracking-activity-api';
import { CHART_HEIGHT_LARGE } from '../@consts';
import type { TrackingFilters, TrackingUserData } from '../@interface';

const BREAK_COLORS = ['var(--color-hue-blue)', 'var(--color-hue-violet)', 'var(--color-hue-emerald)', 'var(--color-hue-orange)', 'var(--color-hue-cyan)'];

export function UsersWhatsappChart({ filters }: UsersWhatsappChartProps) {
  const { t } = useTranslation();
  const { data: rawData, isLoading } = useTrackingUsersWhatsapp(filters);
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
        color: 'var(--color-ui-hard)',
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
    <Item variant="outline" className="flex-col items-stretch w-full">
      <ItemHeader className="items-center flex-col">
        <ItemTitle className="text-xl font-semibold">{t('users.whatsapp')}</ItemTitle>
        <ItemDescription>{t('users.whatsapp.breakdown.description', 'Distribuição de atividades de WhatsApp por usuário')}</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {isEmpty ? (
          <DefaultEmptyData />
        ) : (
          <>
            <div className="relative w-full" style={{ height: `${barHeight}px` }}>
              <TooltipProvider>
                {processedData.map((d, index) => (
                  <Tooltip key={`${d.key}-${index}`}>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute transition-all duration-300 hover:brightness-110 hover:z-10 group cursor-help"
                        style={{
                          width: `${d.width}%`,
                          height: `${barHeight}px`,
                          left: `${d.left}%`,
                        }}
                      >
                        <div
                          className="w-full h-full shadow-sm border-y border-white/5 first:border-l last:border-r"
                          style={{
                            backgroundColor: d.color,
                            borderRadius: d.borderRadius,
                          }}
                        />

                        {d.width > 10 && (
                          <>
                            <div
                              className="absolute pointer-events-none text-white font-semibold text-center w-full"
                              style={{
                                top: `${barHeight / 5}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }}
                            >
                              <ItemDescription className="text-white font-semibold leading-none">{d.label}</ItemDescription>
                            </div>
                            <div
                              className="absolute pointer-events-none text-white text-center w-full"
                              style={{
                                top: `${barHeight * 0.45}px`,
                                left: '50%',
                                transform: 'translateX(-50%)',
                              }}
                            >
                              <p className="text-white text-lg font-bold font-mono tabular-nums">{d.value}</p>
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
                      <div className="flex items-baseline gap-1 mt-1">
                        <ItemTitle className="text-lg font-black tabular-nums">{d.value.toLocaleString()}</ItemTitle>
                        <ItemDescription className="text-xs font-normal uppercase">{t('actions')}</ItemDescription>
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
                    <ItemTitle className="text-xs font-semibold text-muted-foreground uppercase">{item.label}</ItemTitle>
                  </div>
                  <ItemTitle className="tabular-nums font-semibold text-lg">{item.value.toLocaleString()}</ItemTitle>
                </div>
              ))}
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2">
                  <ItemTitle className="text-xs font-semibold text-muted-foreground uppercase">{t('total')}</ItemTitle>
                  <ItemTitle className="tabular-nums font-semibold text-lg">{totalActions.toLocaleString()}</ItemTitle>
                </div>
              </div>
            </ItemFooter>
          </>
        )}
      </ItemContent>
    </Item>
  );
}

interface UsersWhatsappChartProps {
  filters: TrackingFilters;
}
