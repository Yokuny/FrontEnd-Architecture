import { Box, Flag, MapPin, Navigation, Package, Ship, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/formatDate';
import { useIntegrationVoyageDetail } from '../@hooks/use-voyage-integration-api';
import { useVoyageIntegrationStore } from '../@hooks/use-voyage-integration-store';
import type { VoyageEvent } from '../@interface/voyage-integration';
import { AnalyticsVoyage } from './AnalyticsVoyage';
import { ConnectionsVoyage } from './ConnectionsVoyage';
import { StatusOperational } from './StatusOperational';
import { TimelineVoyage } from './TimelineVoyage';

export function DetailsVoyageIntegration() {
  const { t } = useTranslation();
  const selectedVoyage = useVoyageIntegrationStore((state) => state.selectedVoyage);
  const setSelectedVoyage = useVoyageIntegrationStore((state) => state.setSelectedVoyage);

  const { data: detailData, isLoading } = useIntegrationVoyageDetail(selectedVoyage?.idVoyage || null);

  if (!selectedVoyage) return null;

  const getEventsFromVoyages = (voyages: any[]): VoyageEvent[] => {
    return voyages
      .map((x) => {
        const ops = String(x.operations || '');
        const hasFuel = ops.includes('B');
        const suffix = hasFuel ? `+ ${t('fill')}` : '';

        if (x.sequence === 1) {
          return { type: 'init_travel', description: x.port, dateTimeStart: x.dateTimeDeparture, title: suffix } as VoyageEvent;
        }
        if (ops.includes('L')) {
          return { type: 'load', description: x.port, dateTimeStart: x.dateTimeArrival, dateTimeEnd: x.dateTimeDeparture, title: suffix } as VoyageEvent;
        }
        if (ops.includes('D')) {
          return { type: 'finish_travel', description: x.port, dateTimeStart: x.dateTimeArrival, title: suffix } as VoyageEvent;
        }
        if (ops.includes('B')) {
          return { type: 'fuel', description: x.port, dateTimeStart: x.dateTimeArrival, dateTimeEnd: x.dateTimeDeparture } as VoyageEvent;
        }
        return { type: 'other', description: x.port, dateTimeStart: x.dateTimeArrival, dateTimeEnd: x.dateTimeDeparture, title: suffix } as VoyageEvent;
      })
      .sort((a, b) => new Date(a.dateTimeStart).getTime() - new Date(b.dateTimeStart).getTime());
  };

  const events = detailData ? getEventsFromVoyages(detailData) : [];

  return (
    <div className="pointer-events-auto absolute top-[4.7rem] left-[18.2rem] z-1010 h-[calc(92%)] w-80">
      <Card className="flex h-full flex-col overflow-hidden border border-border bg-background/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b p-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation className="size-3" />
              <span className="font-bold text-[10px] uppercase tracking-wider">{t('travel')}</span>
            </div>
            <ItemTitle className="font-bold text-sm">{selectedVoyage.code}</ItemTitle>
          </div>
          <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => setSelectedVoyage(null)}>
            <X className="size-4" />
          </Button>
        </CardHeader>

        <ScrollArea className="flex-1">
          <CardContent className="flex flex-col gap-0 p-4">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Ship className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('vessel')}</span>
                    </div>
                    <span className="truncate font-medium text-xs">{selectedVoyage.machine?.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('customer')}</span>
                    </div>
                    <span className="truncate font-medium text-xs">{selectedVoyage.customer || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('load')}</span>
                    </div>
                    <span className="truncate font-medium text-xs">{selectedVoyage.loadDescription || '-'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Box className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('load.weight')}</span>
                    </div>
                    <span className="truncate font-medium text-xs">{selectedVoyage.loadWeight?.toFixed(1) || '0.0'} T</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('departure')}</span>
                    </div>
                    <span className="font-medium text-xs">{formatDate(new Date(selectedVoyage.dateTimeStart), 'dd MMM, HH:mm')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Flag className="size-3" />
                      <span className="font-bold text-[10px] uppercase tracking-tight">{t('end')}</span>
                    </div>
                    <span className="font-medium text-xs">{formatDate(new Date(selectedVoyage.dateTimeEnd), 'dd MMM, HH:mm')}</span>
                  </div>
                </div>

                <ConnectionsVoyage voyages={detailData || []} />
                <AnalyticsVoyage voyages={detailData || []} />
                <StatusOperational idMachine={selectedVoyage.machine?.id || ''} voyages={detailData || []} />
                <TimelineVoyage events={events} />
              </>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
