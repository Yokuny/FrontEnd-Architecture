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
      <ItemGroup className="p-4 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
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
    <ItemGroup className="p-4 space-y-4">
      {/* Voyage Identification Grid */}
      <ItemContent className="grid grid-cols-2 gap-y-4 gap-x-2 p-2 bg-accent/50 rounded-md border-accent border">
        {gridItems.map((item) => (
          <DetailGridItem key={item.id} label={item.label} icon={item.icon} value={item.value} />
        ))}
      </ItemContent>

      {/* Itinerary Section */}
      <ItemContent className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ItemTitle className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('itinerary')}</ItemTitle>
        </div>

        <div className="space-y-6 relative pl-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {!data.itinerary || data.itinerary.length === 0 ? (
            <div className="text-xs text-muted-foreground italic pl-4">{t('no.itinerary')}</div>
          ) : (
            data.itinerary.map((item: any, i: number) => (
              <div key={item.where} className="relative flex flex-col gap-2 group">
                <div className="absolute -left-[21px] mt-1.5 size-2.5 rounded-full border-2 border-background bg-primary ring-4 ring-background z-10" />

                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{t('local')}</span>
                    <span className="text-sm font-bold group-hover:text-primary transition-colors">
                      {i + 1}# {item.where}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{t('departure')}</span>
                    <span className="text-xs font-bold tabular-nums">{item.atd ? format(new Date(item.atd), 'dd MMM, HH:mm') : '-'}</span>
                  </div>
                </div>

                {item.load && item.load.length > 0 && (
                  <div className="ml-0 p-2 rounded-lg bg-accent/30 border border-primary/5 grid grid-cols-2 gap-x-4 gap-y-1">
                    {item.load.map((l: any, _j: number) => (
                      <div key={l.description} className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground truncate mr-2">{l.description}</span>
                        <span className="font-bold tabular-nums whitespace-nowrap">
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
