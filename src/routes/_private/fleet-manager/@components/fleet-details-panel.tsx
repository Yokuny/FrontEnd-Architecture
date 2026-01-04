import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Navigation2, Ship, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMachineDetails, useVoyageDetails } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetDetailsPanel() {
  const { t } = useTranslation();
  const { selectedMachineId, setSelectedMachineId, selectedVoyageId, setSelectedVoyageId, selectedPanel, setSelectedPanel } = useFleetManagerStore();

  const { data: machineData, isLoading: isLoadingMachine } = useMachineDetails(selectedMachineId) as any;
  const { data: voyageData, isLoading: isLoadingVoyage } = useVoyageDetails(selectedVoyageId) as any;

  const onClose = () => {
    setSelectedMachineId(null);
    setSelectedVoyageId(null);
  };

  const isLoading = isLoadingMachine || isLoadingVoyage;
  const data = machineData || voyageData;

  if (!data && !isLoading) return null;

  return (
    <ItemGroup className="absolute top-4 right-4 bottom-4 w-96 z-10 flex flex-col shadow-2xl bg-background/95 backdrop-blur-md border border-primary/10 rounded-xl overflow-hidden transition-all duration-300 animate-in slide-in-from-right-4 pointer-events-auto">
      <Item size="sm" className="p-4 border-b border-primary/10 rounded-none bg-primary/5">
        <ItemHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">{selectedMachineId ? <Ship className="size-5 text-primary" /> : <Navigation2 className="size-5 text-primary" />}</div>
            <div>
              <ItemTitle className="text-sm font-bold tracking-tight">{selectedMachineId ? machineData?.machine?.name || t('vessel') : voyageData?.code || t('travel')}</ItemTitle>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{selectedMachineId ? t('active.owner') : t('travel.history')}</p>
            </div>
          </div>
          <ItemActions>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </ItemActions>
        </ItemHeader>
      </Item>

      <ScrollArea className="flex-1 no-scrollbar">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <DefaultLoading />
          ) : selectedMachineId ? (
            /* Machine Details */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailGridItem
                  label={t('status')}
                  value={
                    <Badge variant={machineData?.status === 'OPERATING' ? 'default' : 'secondary'} className="text-[10px] h-5">
                      {machineData?.status || 'N/A'}
                    </Badge>
                  }
                />
                <DetailGridItem label={t('id')} value={machineData?.machine?.id} />
                <DetailGridItem label={t('speed')} value={machineData?.lastPosition?.speed ? `${machineData.lastPosition.speed} kn` : '0 kn'} />
                <DetailGridItem label={t('course')} value={machineData?.lastPosition?.course ? `${machineData.lastPosition.course}°` : '0°'} />
              </div>

              <Separator className="bg-primary/5" />

              <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                  <MapPin className="size-3" /> {t('last.position')}
                </h4>
                <p className="text-xs font-medium bg-accent/50 p-2 rounded-md border border-primary/5">
                  {machineData?.lastPosition?.lat?.toFixed(6)}, {machineData?.lastPosition?.lon?.toFixed(6)}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{machineData?.lastPosition?.timestamp ? format(new Date(machineData.lastPosition.timestamp * 1000), 'dd/MM/yy HH:mm:ss') : '-'}</span>
                </div>
              </div>

              {machineData?.travel && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Navigation2 className="size-3" /> {t('current.travel')}
                  </h4>
                  <div className="bg-accent/30 p-3 rounded-lg border border-primary/5 space-y-2">
                    <div className="text-sm font-bold">{machineData.travel.code}</div>
                    <div className="flex justify-between text-xs items-center">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-[10px]">{t('source')}</span>
                        <span className="font-medium">{machineData.travel.portPointStart?.code || '-'}</span>
                      </div>
                      <div className="h-[2px] flex-1 bg-primary/20 mx-3 relative">
                        <div className="absolute -top-1 left-0 size-2 rounded-full bg-primary/40" />
                        <div className="absolute -top-1 right-0 size-2 rounded-full border-2 border-primary/20 bg-background" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-muted-foreground text-[10px]">{t('destiny.port')}</span>
                        <span className="font-medium">{machineData.travel.portPointEnd?.code || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-primary/5" />

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button
                  variant={selectedPanel === 'info' ? 'default' : 'secondary'}
                  size="sm"
                  className="text-[10px] font-bold uppercase h-9 shadow-sm"
                  onClick={() => setSelectedPanel('info')}
                >
                  {t('info')}
                </Button>
                <Button
                  variant={selectedPanel === 'crew' ? 'default' : 'secondary'}
                  size="sm"
                  className="text-[10px] font-bold uppercase h-9 shadow-sm"
                  onClick={() => setSelectedPanel('crew')}
                >
                  {t('crew')}
                </Button>
                <Button
                  variant={selectedPanel === 'consume' ? 'default' : 'secondary'}
                  size="sm"
                  className="text-[10px] font-bold uppercase h-9 shadow-sm"
                  onClick={() => setSelectedPanel('consume')}
                >
                  {t('consume')}
                </Button>
              </div>
            </div>
          ) : (
            /* Voyage Details */
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent rounded-md">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase">{t('departure')}</p>
                    <p className="text-sm font-semibold">{voyageData?.dateTimeStart ? format(new Date(voyageData.dateTimeStart), 'dd MMM yyyy, HH:mm') : '-'}</p>
                  </div>
                </div>
                {voyageData?.dateTimeEnd && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent rounded-md">
                      <Clock className="size-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase">{t('arrival')}</p>
                      <p className="text-sm font-semibold">{voyageData?.dateTimeEnd ? format(new Date(voyageData.dateTimeEnd), 'dd MMM yyyy, HH:mm') : '-'}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-primary/5" />

              <div className="space-y-4">
                <DetailGridItem label={t('vessel')} value={<span className="font-bold text-primary">{voyageData?.machine?.name}</span>} />

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-accent/30 rounded-lg border border-primary/5 space-y-3">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-1 items-center">
                        <div className="size-2 rounded-full bg-primary" />
                        <div className="w-px h-8 bg-border" />
                        <div className="size-2 rounded-full border border-primary bg-background" />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{t('source')}</span>
                          <span className="text-sm font-medium">
                            {voyageData?.portPointStart?.code} - {voyageData?.portPointStart?.description}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{t('destiny.port')}</span>
                          <span className="text-sm font-medium">
                            {voyageData?.portPointEnd?.code || voyageData?.portPointDestiny?.code} -{' '}
                            {voyageData?.portPointEnd?.description || voyageData?.portPointDestiny?.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </ItemGroup>
  );
}

function DetailGridItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{label}</p>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}
