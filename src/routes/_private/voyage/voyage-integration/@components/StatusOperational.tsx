import { Anchor, Navigation, Radio, Settings, Ship, TrendingDown, TrendingUp, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { useOperationalStatus } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import type { IntegrationVoyageDetail } from '../@interface/voyage-integration';

interface StatusOperationalProps {
  idMachine: string;
  voyages: IntegrationVoyageDetail[];
}

export function StatusOperational({ idMachine, voyages }: StatusOperationalProps) {
  const { t } = useTranslation();
  const kickVoyageFilter = useVoyageIntegrationStore((state) => state.kickVoyageFilter);

  const min = kickVoyageFilter ? kickVoyageFilter.dateTimeDeparture : voyages?.[0]?.dateTimeEnd; // The legacy uses some logic with dateTimeArrival/dateTimeDeparture
  const max = kickVoyageFilter ? kickVoyageFilter.dateTimeArrival : voyages?.length ? voyages[voyages.length - 1].dateTimeStart : undefined;

  const { data: eventStatus, isLoading } = useOperationalStatus(idMachine, min, max);

  const getStatusInfo = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('fast transit')) return { icon: TrendingUp, color: 'text-success', label: t('fast.transit') };
    if (s.includes('transit') || s.includes('underway')) return { icon: Navigation, color: 'text-success', label: t('in.travel') };
    if (s === 'slow') return { icon: TrendingDown, color: 'text-warning', label: t('slow') };
    if (s.includes('anchor') || s === 'stopped') return { icon: Anchor, color: 'text-warning', label: t('at.anchor') };
    if (s === 'moored' || s === 'port') return { icon: Warehouse, color: 'text-primary', label: t('moored') };
    if (s === 'dp') return { icon: Radio, color: 'text-info', label: 'DP' };
    if (s.includes('standby') || s.includes('stand by')) return { icon: Radio, color: 'text-orange-500', label: t('stand.by') };
    if (s === 'dock') return { icon: Settings, color: 'text-warning', label: t('dock') };
    return { icon: Ship, color: 'text-muted-foreground', label: t('other') };
  };

  return (
    <div className="flex flex-col gap-3 border-b py-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <ItemTitle className="text-xs uppercase tracking-wider opacity-70">{t('time.operation')}</ItemTitle>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {eventStatus
            ?.sort((a, b) => b.minutes - a.minutes)
            ?.map((x, i) => {
              const info = getStatusInfo(x.status);
              const Icon = info.icon;
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn('rounded-sm bg-muted/50 p-1', info.color)}>
                      <Icon className="size-3.5" />
                    </div>
                    <span className="text-muted-foreground">{info.label}</span>
                  </div>
                  <span className="font-bold">{(x.minutes / 60).toFixed(1)} hrs</span>
                </div>
              );
            })}

          {!!eventStatus?.length && (
            <div className="mt-1 flex items-center justify-between border-t border-dashed pt-1 font-bold text-xs">
              <span className="ml-7 text-[10px] uppercase opacity-70">{t('total')}</span>
              <span>{(eventStatus.reduce((a, b) => a + b.minutes, 0) / 60).toFixed(1)} hrs</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Add cn helper since it's used
import { cn } from '@/lib/utils';
