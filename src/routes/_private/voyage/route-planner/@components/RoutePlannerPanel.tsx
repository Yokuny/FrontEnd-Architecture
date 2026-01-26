import { BrushCleaning, MapPin, Minus, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/formatDate';
import { useRouteApi, useRouteHistory } from '../@hooks/use-route-planner-api';

interface RoutePlannerPanelProps {
  filterParams: any;
  onChange: (field: string, value: any) => void;
  calculateRoute: () => void;
  canRoute: boolean;
  isRouting: boolean;
  setSelectTarget: (target: 'origin' | 'destination' | null) => void;
  selectTarget: 'origin' | 'destination' | null;
  resetRoute: () => void;
  routeGeoJson: any;
  loadRouteFromHistory: (data: any) => void;
}

export function RoutePlannerPanel({
  filterParams,
  onChange,
  calculateRoute,
  canRoute,
  isRouting,
  setSelectTarget,
  selectTarget,
  resetRoute,
  routeGeoJson,
  loadRouteFromHistory,
}: RoutePlannerPanelProps) {
  const { t } = useTranslation();
  const { data: history, isLoading: loadingHistory } = useRouteHistory() as { data: any[]; isLoading: boolean };
  const { saveRoute, deleteRoute } = useRouteApi();

  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showSaveRoute, setShowSaveRoute] = useState(false);
  const [routeDescription, setRouteDescription] = useState('');

  const handleSaveRoute = async () => {
    if (!routeDescription.trim() || !routeGeoJson) return;
    await saveRoute.mutateAsync({
      description: routeDescription,
      routeGeoJson: routeGeoJson.features,
    });
    setRouteDescription('');
    setShowSaveRoute(false);
  };

  return (
    <div className="pointer-events-auto absolute top-4 left-4 z-1000 w-72">
      <Item variant="outline" className="flex-col gap-0 bg-background/95 p-0">
        <ItemHeader className="p-4">
          <ItemTitle>{t('route.planner')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="flex w-full flex-col gap-4 p-4">
          {/* Origin */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs">{t('departure')} (A)</Label>
            <ItemContent className="flex-row">
              <Button variant={selectTarget === 'origin' ? 'default' : 'outline'} onClick={() => setSelectTarget(selectTarget === 'origin' ? null : 'origin')}>
                <MapPin className="size-3" />
              </Button>
              <Input
                placeholder="Lat"
                className="text-xs"
                type="number"
                value={filterParams.origin?.lat || ''}
                onChange={(e) => onChange('origin', { ...filterParams.origin, lat: parseFloat(e.target.value) })}
              />
              <Input
                placeholder="Lon"
                className="text-xs"
                type="number"
                value={filterParams.origin?.lng || ''}
                onChange={(e) => onChange('origin', { ...filterParams.origin, lng: parseFloat(e.target.value) })}
              />
            </ItemContent>
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs">{t('arrival')} (B)</Label>
            <ItemContent className="flex-row">
              <Button variant={selectTarget === 'destination' ? 'default' : 'outline'} onClick={() => setSelectTarget(selectTarget === 'destination' ? null : 'destination')}>
                <MapPin className="size-3" />
              </Button>
              <Input
                placeholder="Lat"
                className="text-xs"
                type="number"
                value={filterParams.destination?.lat || ''}
                onChange={(e) => onChange('destination', { ...filterParams.destination, lat: parseFloat(e.target.value) })}
              />
              <Input
                placeholder="Lon"
                className="text-xs"
                type="number"
                value={filterParams.destination?.lng || ''}
                onChange={(e) => onChange('destination', { ...filterParams.destination, lng: parseFloat(e.target.value) })}
              />
            </ItemContent>
          </div>

          <ItemContent className="flex-row justify-center gap-2">
            <Button className="text-amber-700 text-xs hover:text-amber-800" onClick={resetRoute}>
              <BrushCleaning className="size-4" />
            </Button>
            <Button variant="outline" className="text-xs" onClick={() => setShowRestrictions(true)}>
              {t('restrictions')}
            </Button>
            <Button className="text-xs" variant={'secondary'} disabled={!canRoute || isRouting} onClick={calculateRoute}>
              {isRouting ? <Spinner className="size-3" /> : t('route')}
            </Button>
          </ItemContent>

          {routeGeoJson && (
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{t('save.route')}</Label>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowSaveRoute(!showSaveRoute)}>
                  {showSaveRoute ? <Minus className="size-3" /> : <Plus className="size-3" />}
                </Button>
              </div>
              {showSaveRoute && (
                <div className="mt-2 flex flex-col gap-2">
                  <Input placeholder={t('route.description')} className="h-8 text-xs" value={routeDescription} onChange={(e) => setRouteDescription(e.target.value)} />
                  <Button size="sm" className="h-8 gap-2 text-xs" disabled={!routeDescription.trim() || saveRoute.isPending} onClick={handleSaveRoute}>
                    {saveRoute.isPending ? <Spinner className="size-3" /> : <Save className="size-3" />}
                    {t('save')}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-2">
            <Label className="text-xs">{t('route.history')}</Label>
            <ScrollArea className="mt-2 h-32">
              {loadingHistory ? (
                <Item className="flex justify-center">
                  <Spinner />
                </Item>
              ) : history?.length === 0 ? (
                <Item className="text-center text-muted-foreground text-xs">{t('no.routes.found')}</Item>
              ) : (
                <ItemGroup>
                  {history?.map((route: any) => (
                    <Item key={route.id} size="sm" className="cursor-pointer bg-secondary" onClick={() => loadRouteFromHistory(route)}>
                      <ItemContent>
                        <ItemTitle className="truncate text-xs">{route.description}</ItemTitle>
                        <ItemDescription className="text-xs">{formatDate(new Date(route.createdAt), 'dd MMM yy')}</ItemDescription>
                      </ItemContent>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRoute.mutate(route.id);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </Item>
                  ))}
                </ItemGroup>
              )}
            </ScrollArea>
          </div>
        </ItemContent>
      </Item>

      <Dialog open={showRestrictions} onOpenChange={setShowRestrictions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('restrictions')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">{t('draftRestriction')} (m)</Label>
              <Input type="number" step="0.1" value={filterParams.draftRestriction || ''} onChange={(e) => onChange('draftRestriction', parseFloat(e.target.value))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">{t('waveHeightRestriction')} (m)</Label>
              <Input type="number" step="0.1" value={filterParams.waveHeightRestriction || ''} onChange={(e) => onChange('waveHeightRestriction', parseFloat(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestrictions(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => setShowRestrictions(false)}>{t('apply')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
