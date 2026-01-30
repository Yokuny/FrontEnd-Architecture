import { Box, Flag, MapPin, Navigation, Package, Ship, SidebarClose, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { formatDate } from '@/lib/formatDate';
import { useIntegrationVoyageDetail, useIntegrationVoyages } from '../@hooks/use-voyage-integration-api';
import type { VoyageEvent } from '../@interface/voyage-integration';
import { Route } from '../index';
import { AnalyticsVoyage } from './details-analytics';
import { ConnectionsVoyage } from './details-connections';
import { OperationalTime } from './details-operational-time';
import { TimelineVoyage } from './details-timeline';

export function VoyageDetailsPanel() {
  const { t } = useTranslation();
  const idEnterprise = useEnterpriseFilter((state) => state.idEnterprise);
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const { idMachine, code } = searchParams;

  const { data: voyages } = useIntegrationVoyages(idEnterprise || '', idMachine || null);
  const selectedVoyage = voyages?.find((v) => v.code === code);

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
    <div className="pointer-events-auto min-h-0 max-w-80">
      <div className="flex h-full flex-col gap-2 overflow-hidden border-r-border p-4 pb-20 md:min-w-60">
        <ItemHeader className="flex-none border-b pb-2">
          <Button size="icon-sm" onClick={() => navigate({ search: { ...searchParams, code: undefined } })}>
            <SidebarClose className="size-4" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation className="size-3" />
              <ItemTitle className="font-bold text-[10px] uppercase tracking-wider">{t('travel')}</ItemTitle>
            </div>
            <ItemTitle className="font-bold">{selectedVoyage.code}</ItemTitle>
          </div>
        </ItemHeader>

        <ScrollArea className="h-full">
          <ItemContent className="flex flex-col gap-0">
            {isLoading ? (
              <Skeleton className="flex justify-center p-12 md:min-w-56">
                <Spinner />
              </Skeleton>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 border-b py-3">
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <Ship className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('vessel')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="truncate text-xs">{selectedVoyage.machine?.name}</ItemTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <User className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('customer')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="truncate text-xs">{selectedVoyage.customer || '-'}</ItemTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <Package className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('load')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="truncate text-xs">{selectedVoyage.loadDescription || '-'}</ItemTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <Box className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('load.weight')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="truncate text-xs">{selectedVoyage.loadWeight?.toFixed(1) || '0.0'} T</ItemTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <MapPin className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('departure')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="font-medium text-xs">{formatDate(new Date(selectedVoyage.dateTimeStart), 'dd MMM, HH:mm')}</ItemTitle>
                  </div>
                  <div className="flex flex-col gap-1">
                    <ItemContent className="flex-row text-muted-foreground">
                      <Flag className="size-3" />
                      <ItemTitle className="font-bold text-[10px] uppercase">{t('end')}</ItemTitle>
                    </ItemContent>
                    <ItemTitle className="font-medium text-xs">{formatDate(new Date(selectedVoyage.dateTimeEnd), 'dd MMM, HH:mm')}</ItemTitle>
                  </div>
                </div>

                <ConnectionsVoyage voyages={detailData || []} />
                <AnalyticsVoyage voyages={detailData || []} />
                <OperationalTime idMachine={selectedVoyage.machine?.id || ''} voyages={detailData || []} />
                <TimelineVoyage events={events} />
              </>
            )}
          </ItemContent>
        </ScrollArea>
      </div>
    </div>
  );
}
