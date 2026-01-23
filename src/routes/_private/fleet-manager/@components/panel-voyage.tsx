import { format } from 'date-fns';
import { Box, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item';
import { useLastVoyage } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { DetailGridItem } from './helpers/detail-items';

export function FleetLastVoyagePanel() {
  const { t } = useTranslation();
  const { selectedMachineId } = useFleetManagerStore();
  const { data, isLoading } = useLastVoyage(selectedMachineId);

  if (isLoading) {
    return (
      <ItemGroup className="p-4">
        <DefaultLoading />
      </ItemGroup>
    );
  }

  if (!data || !data.code) {
    return (
      <ItemGroup className="flex-1 p-4">
        <div className="flex min-h-96 flex-1 flex-col items-center justify-center">
          <DefaultEmptyData />
        </div>
      </ItemGroup>
    );
  }

  const gridItems = [
    { id: 'vessel', label: t('vessel'), icon: Ship, value: data.machine?.name || '-' },
    { id: 'code', label: t('code'), icon: Box, value: data.code || '-' },
  ];

  return (
    <ItemGroup className="space-y-4 p-4">
      {/* Voyage Identification Grid */}
      <ItemContent className="grid grid-cols-2 gap-x-2 gap-y-4 rounded-md border border-accent bg-accent/50 p-2">
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      {/* Itinerary Section */}
      <ItemContent className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ItemTitle className="font-bold text-[10px] text-muted-foreground uppercase tracking-tight">{t('itinerary')}</ItemTitle>
        </div>

        <div className="relative space-y-6 pl-4 before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-px before:bg-border">
          {!data.itinerary || data.itinerary.length === 0 ? (
            <div className="pl-4 text-muted-foreground text-xs italic">{t('no.itinerary')}</div>
          ) : (
            data.itinerary.map((item: any, i: number) => (
              <div key={item.where} className="group relative flex flex-col gap-2">
                <div className="absolute -left-[21px] z-10 mt-1.5 size-2.5 rounded-full border-2 border-background bg-primary ring-4 ring-background" />

                <div className="flex w-full items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">{t('local')}</span>
                    <span className="font-bold text-sm transition-colors group-hover:text-primary">
                      {i + 1}# {item.where}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-tighter">{t('departure')}</span>
                    <span className="font-bold text-xs tabular-nums">{item.atd ? format(new Date(item.atd), 'dd MMM, HH:mm') : '-'}</span>
                  </div>
                </div>

                {item.load && item.load.length > 0 && (
                  <div className="ml-0 grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border border-primary/5 bg-accent/30 p-2">
                    {item.load.map((l: any, _j: number) => (
                      <div key={l.description} className="flex items-center justify-between text-[11px]">
                        <span className="mr-2 truncate text-muted-foreground">{l.description}</span>
                        <span className="whitespace-nowrap font-bold tabular-nums">
                          {l.amount} {l.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ItemContent>
    </ItemGroup>
  );
}
