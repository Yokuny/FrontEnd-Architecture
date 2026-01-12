import { format, isAfter } from 'date-fns';
import { AlertTriangle, Anchor, ArrowBigUpDash, CheckCircle2, Clock, Flag, Locate, MoveRight, Navigation, Route, Search, Ship, Wind, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@/components/ui/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useFleetMachines, useFleetVoyages } from '../@hooks/use-fleet-api';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';
import { Proximity } from './proximity';

interface FleetSidebarProps {
  idEnterprise?: string;
}

export function FleetManagerPanel({ idEnterprise }: FleetSidebarProps) {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const { selectedMachineId, setSelectedMachineId, selectedVoyageId, setSelectedVoyageId, setSelectedPanel } = useFleetManagerStore();

  const { data: machines, isLoading: isLoadingMachines } = useFleetMachines({
    idEnterprise,
    search: searchText,
  });

  const { data: voyagesData, isLoading: isLoadingVoyages } = useFleetVoyages({
    idEnterprise,
    search: searchText,
    page: 0,
    size: 50,
  });

  const voyages = voyagesData?.data || [];

  return (
    <ItemGroup className="p-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4" />
        <Input placeholder={t('search')} className="pl-9 h-9" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        {searchText && (
          <button type="button" className="absolute right-2.5 top-2.5" onClick={() => setSearchText('')}>
            <X className="size-4" />
          </button>
        )}
      </div>

      <Tabs defaultValue="assets">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="assets">{t('active.owner')}</TabsTrigger>
          <TabsTrigger value="voyages">{t('travel')}</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-0">
          {isLoadingMachines ? (
            <DefaultLoading />
          ) : machines?.length === 0 ? (
            <EmptyData />
          ) : (
            <ItemGroup>
              {machines?.map((item) => {
                const getStatusConfig = (status?: string) => {
                  const s = status?.toLowerCase() || '';
                  if (['underway using engine', 'underway_using_engine', 'underway', 'under way', 'under way using engine', 'under_way_using_engine', 'transit'].includes(s)) {
                    return { label: t('in.travel'), icon: Navigation, color: 'bg-green-500', text: 'text-green-500' };
                  }
                  if (['at anchor', 'at_anchor', 'stopped', 'stop'].includes(s)) {
                    return { label: t('at.anchor'), icon: Anchor, color: 'bg-orange-500', text: 'text-orange-500' };
                  }
                  if (['moored', 'port'].includes(s)) {
                    return { label: t('moored'), icon: Anchor, color: 'bg-blue-500', text: 'text-blue-500' };
                  }
                  if (['dock'].includes(s)) {
                    return { label: t('dock'), icon: Ship, color: 'bg-orange-900', text: 'text-orange-900' };
                  }
                  if (['dp'].includes(s)) {
                    return { label: t('dp'), icon: Route, color: 'bg-cyan-500', text: 'text-cyan-500' };
                  }
                  if (['stand by', 'stand_by', 'standby'].includes(s)) {
                    return { label: t('stand.by'), icon: Clock, color: 'bg-orange-600', text: 'text-orange-600' };
                  }
                  if (['fast transit', 'fasttransit', 'fast_transit'].includes(s)) {
                    return { label: 'Viagem Rápida', icon: Zap, color: 'bg-green-700', text: 'text-green-700' };
                  }
                  if (['slow'].includes(s)) {
                    return { label: t('slow', 'Devagar'), icon: Navigation, color: 'bg-green-400', text: 'text-green-400' };
                  }
                  if (['restricted manoeuvrability'].includes(s)) {
                    return { label: t('restricted.manoeuvrabilitys'), icon: AlertTriangle, color: 'bg-orange-600', text: 'text-orange-600' };
                  }
                  if (['underway by sail'].includes(s)) {
                    return { label: t('underway.sail'), icon: Wind, color: 'bg-cyan-500', text: 'text-cyan-500' };
                  }
                  return { label: status || t('unknown'), icon: Ship, color: 'bg-slate-400', text: 'text-slate-400' };
                };

                const statusConfig = getStatusConfig(item.lastState?.statusNavigation);
                const StatusIcon = statusConfig.icon;

                return (
                  <Item
                    key={item.machine.id}
                    asChild
                    variant="outline"
                    className={cn('w-full p-3 cursor-pointer hover:bg-accent', selectedMachineId === item.machine.id && 'bg-accent')}
                    onClick={() => {
                      setSelectedVoyageId(null);
                      setSelectedMachineId(item.machine.id);
                      setSelectedPanel('details');
                    }}
                  >
                    <ItemContent className="grow items-start gap-0">
                      <div className="flex items-center w-full justify-between">
                        <ItemTitle className="font-semibold text-sm truncate leading-tight">
                          {item.machine.code ? `${item.machine.code} - ` : ''}
                          {item.machine.name}
                        </ItemTitle>
                        <Badge className={cn('px-1 flex h-4 text-[10px] uppercase font-bold text-white', statusConfig.color)}>
                          <StatusIcon className="size-2.5 fill-white" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="flex items-end w-full justify-between">
                        <ItemContent className="w-full text-[10px]">
                          {item.lastState?.eta && (
                            <div className="flex items-center gap-1.5">
                              <Flag className="size-3 shrink-0" />
                              <span className="truncate">ETA: {format(new Date(item.lastState.eta), 'dd MMM HH:mm')}</span>
                            </div>
                          )}

                          {item.lastState?.speed !== undefined && (
                            <div className="flex items-center gap-1.5">
                              <ArrowBigUpDash className="size-3 shrink-0" />
                              <span>
                                {item.lastState.speed.toFixed(1)} {t('kn')}
                              </span>
                            </div>
                          )}

                          {item.lastState?.destiny && (
                            <div className="flex items-center gap-1.5">
                              <Navigation className="size-3 shrink-0" />
                              <span className="truncate">{item.lastState.destiny}</span>
                            </div>
                          )}

                          {item.lastState?.coordinate && (
                            <div className="flex items-center gap-1.5">
                              <Locate className="size-3 shrink-0 animate-pulse" />
                              <Proximity latitude={item.lastState.coordinate[0]} longitude={item.lastState.coordinate[1]} />
                            </div>
                          )}
                        </ItemContent>
                        <div className="shrink-0">
                          {item.modelMachine?.icon?.url ? (
                            <img src={item.modelMachine.icon.url} className="size-6 object-contain" alt="" />
                          ) : (
                            <Navigation className={cn('size-4', statusConfig.text)} />
                          )}
                        </div>
                      </div>
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
        </TabsContent>

        <TabsContent value="voyages" className="mt-0">
          {isLoadingVoyages ? (
            <DefaultLoading />
          ) : voyages.length === 0 ? (
            <EmptyData />
          ) : (
            <ItemGroup>
              {voyages.map((item) => {
                const getVoyageStatusConfig = () => {
                  if (item.dateTimeEnd || item.metadata?.dateTimeArrival) {
                    return { label: t('finished.travel'), icon: CheckCircle2, color: 'bg-green-500' };
                  }
                  if (item.metadata?.eta) {
                    const late = isAfter(new Date(), new Date(item.metadata.eta));
                    return {
                      label: late ? t('late') : t('scheduled'),
                      icon: Clock,
                      color: late ? 'bg-destructive' : 'bg-primary',
                    };
                  }
                  return { label: t('in.progress'), icon: Navigation, color: 'bg-orange-500' };
                };

                const statusConfig = getVoyageStatusConfig();
                const portFinal = item.portPointDestiny || item.portPointEnd;

                return (
                  <Item
                    key={item.id}
                    asChild
                    variant="outline"
                    className={cn('w-full p-3 cursor-pointer hover:bg-accent', selectedVoyageId === item.id && 'bg-accent')}
                    onClick={() => {
                      setSelectedMachineId(item.machine?.id || null);
                      setSelectedVoyageId(item.id);
                      setSelectedPanel('voyage');
                    }}
                  >
                    <ItemContent className="grow items-start gap-0">
                      <div className="flex items-center w-full justify-between">
                        <ItemTitle className="font-semibold text-sm truncate leading-tight">{item.code}</ItemTitle>
                        <Badge className={cn('px-1 h-4 text-[10px] uppercase font-bold', statusConfig.color)}>{statusConfig.label}</Badge>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ItemContent>
                          {item.machine?.image?.url ? <img src={item.machine.image.url} className="size-5 object-contain" alt="#" /> : <Ship className="size-4" />}
                        </ItemContent>
                        <ItemDescription className="truncate">{item.machine?.name}</ItemDescription>
                      </div>

                      <div className="flex items-center justify-between w-full gap-4 mt-1">
                        <div className="flex flex-col items-start">
                          <ItemTitle>{item.portPointStart?.code || '-'}</ItemTitle>
                          <div className="text-[10px] leading-tight">
                            {(() => {
                              const d = item.metadata?.dateTimeArrival || item.dateTimeStart;
                              if (!d) return '-';
                              const date = new Date(d);
                              return (
                                <>
                                  <div className="whitespace-nowrap">{format(date, 'dd MMM yy')}</div>
                                  <div>{format(date, 'HH:mm')}</div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        <MoveRight className="size-4 text-muted-foreground" />

                        <div className="flex flex-col items-end">
                          <ItemTitle>{portFinal?.code || '-'}</ItemTitle>
                          <div className="text-[10px] leading-tight flex flex-col items-end">
                            {item.metadata?.eta && (
                              <div className="flex flex-col items-end">
                                <span className="font-bold text-muted-foreground">ETA</span>
                                <div className="whitespace-nowrap">{format(new Date(item.metadata.eta), 'dd MMM yy')}</div>
                                <div>{format(new Date(item.metadata.eta), 'HH:mm')}</div>
                              </div>
                            )}
                            {(item.metadata?.dateTimeArrival || item.dateTimeEnd) && (
                              <div className="flex flex-col items-end mt-1 border-t border-muted/20 pt-1">
                                <div className="whitespace-nowrap">{format(new Date(item.metadata?.dateTimeArrival || item.dateTimeEnd || ''), 'dd MMM yy')}</div>
                                <div>{format(new Date(item.metadata?.dateTimeArrival || item.dateTimeEnd || ''), 'HH:mm')}</div>
                              </div>
                            )}
                            {!item.metadata?.eta && !item.metadata?.dateTimeArrival && !item.dateTimeEnd && '-'}
                          </div>
                        </div>
                      </div>
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemGroup>
          )}
        </TabsContent>
      </Tabs>
    </ItemGroup>
  );
}
