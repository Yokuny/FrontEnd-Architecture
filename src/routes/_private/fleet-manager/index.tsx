import { createFileRoute } from '@tanstack/react-router';
import { Archive, BarChart3, Calculator, Contact2, Layers, Route as LucideRoute, MapPin, Menu, Wind, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { cn } from '@/lib/utils';
import { FleetConsumePanel } from './@components/fleet-consume-panel';
import { FleetCrewPanel } from './@components/fleet-crew-panel';
import { FleetDetailsPanel } from './@components/fleet-details-panel';
import { FleetInfoPanel } from './@components/fleet-info-panel';
import { FleetMap } from './@components/fleet-map';
import { FleetMeasurePanel } from './@components/fleet-measure-panel';
import { FleetSidebar } from './@components/fleet-sidebar';
import { FleetWindMap } from './@components/fleet-wind-map';
import { PlaybackTimeline } from './@components/playback-timeline';
import { useFleetHistory, useRegionPlayback } from './@hooks/use-fleet-api';
import { useFleetManagerStore } from './@hooks/use-fleet-manager-store';

const fleetManagerSearchSchema = z.object({
  idVoyage: z.string().optional(),
  codeVoyage: z.string().optional(),
  request: z.string().optional(),
});

type FleetManagerSearch = z.infer<typeof fleetManagerSearchSchema>;

export const Route = createFileRoute('/_private/fleet-manager/')({
  component: FleetManagerPage,
  validateSearch: (search: Record<string, unknown>): FleetManagerSearch => fleetManagerSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'fleet.manager',
  }),
});

function FleetManagerPage() {
  const { t } = useTranslation();
  const { idEnterprise } = useEnterpriseFilter();
  const {
    selectedMachineId,
    selectedVoyageId,
    selectedPanel,
    setSelectedPanel,
    showNames,
    toggleShowNames,
    showCodes,
    toggleShowCodes,
    showGeofences,
    toggleShowGeofences,
    mapTech,
    setMapTech,
    showPlatforms,
    setShowPlatforms,
    showBouys,
    setShowBouys,
    showMeasureLine,
    setShowMeasureLine,
    playback,
    setPlaybackActive,
    setPlaybackData,
    setPlaybackTime,
    isSidebarOpen,
    toggleSidebar,
  } = useFleetManagerStore();

  // Fetch data hooks (enabled conditionally)
  const { data: historyData, isLoading: isLoadingHistory } = useFleetHistory({
    idMachine: selectedMachineId || undefined,
    hours: 24,
  });

  const { data: regionData, isLoading: isLoadingRegion } = useRegionPlayback({
    hours: 5,
    idEnterprise: idEnterprise || undefined,
  });

  const handleStartRoutePlayback = () => {
    if (historyData?.length) {
      const startTime = historyData[0][0] * 1000;
      const endTime = historyData[historyData.length - 1][0] * 1000;
      setPlaybackData(historyData, startTime, endTime);
      setPlaybackActive(true, 'route');
    }
  };

  const handleStartRegionPlayback = () => {
    if (regionData?.length) {
      const startTime = regionData[0][0] * 1000;
      const endTime = regionData[regionData.length - 1][0] * 1000;
      setPlaybackData(regionData, startTime, endTime);
      setPlaybackActive(true, 'region');
    }
  };

  const startTime = playback.historyData?.[0]?.[0] * 1000 || 0;
  const endTime = playback.historyData?.[playback.historyData.length - 1]?.[0] * 1000 || 0;

  return (
    <Card className="p-0 border-none shadow-none bg-none h-full rounded-none">
      <div className="fixed inset-0 z-0 text-foreground">{mapTech === 'windy' ? <FleetWindMap idEnterprise={idEnterprise} /> : <FleetMap idEnterprise={idEnterprise} />}</div>

      <CardContent className="p-0 relative h-full flex overflow-hidden pointer-events-none">
        <div className={cn('h-full transition-all duration-300 ease-in-out no-scrollbar flex pointer-events-auto', isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden')}>
          <FleetSidebar idEnterprise={idEnterprise} />
        </div>

        <div className="flex-1 relative h-full">
          {/* Left Buttons Container */}
          <div className="absolute top-4 left-4 z-50 flex flex-col gap-2 pointer-events-auto">
            <Button variant="secondary" size="icon" className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10" onClick={toggleSidebar}>
              <Menu className="size-4" />
            </Button>
            {/* Third Fleet Search Placeholder */}
          </div>

          {/* Right Buttons Container */}
          <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
            {/* Map Layers & Config */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10">
                  <Layers className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-4 space-y-4 shadow-xl">
                <h4 className="font-bold text-xs uppercase text-muted-foreground tracking-wider">{t('options')}</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-primary/70">{t('map')}</Label>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={mapTech === 'standard' ? 'default' : 'ghost'}
                        size="sm"
                        className="justify-start text-xs h-9 px-4 rounded-md"
                        onClick={() => setMapTech('standard')}
                      >
                        <MapPin className="size-3 mr-2" /> {t('standard')}
                      </Button>
                      <Button
                        variant={mapTech === 'windy' ? 'default' : 'ghost'}
                        size="sm"
                        className="justify-start text-xs h-9 px-4 rounded-md"
                        onClick={() => setMapTech('windy')}
                      >
                        <Wind className="size-3 mr-2" /> {t('weather')}
                      </Button>
                    </div>
                  </div>

                  {playback.isActive && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase text-primary/70">{t('playback')}</Label>
                      <Slider
                        value={[playback.currentTime]}
                        min={startTime}
                        max={endTime}
                        step={1000}
                        onValueChange={([val]: number[]) => setPlaybackTime(val)}
                        className="py-2 cursor-pointer"
                      />
                    </div>
                  )}

                  <Separator className="opacity-50" />

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-primary/70">{t('details')}</Label>
                    <div className="space-y-2 px-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-names" checked={showNames} onCheckedChange={toggleShowNames} />
                        <Label htmlFor="show-names" className="text-xs font-medium cursor-pointer">
                          {t('name')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-codes" checked={showCodes} onCheckedChange={toggleShowCodes} />
                        <Label htmlFor="show-codes" className="text-xs font-medium cursor-pointer">
                          {t('code')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-geofences" checked={showGeofences} onCheckedChange={toggleShowGeofences} />
                        <Label htmlFor="show-geofences" className="text-xs font-medium cursor-pointer">
                          {t('geofences')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-platforms" checked={showPlatforms} onCheckedChange={setShowPlatforms} />
                        <Label htmlFor="show-platforms" className="text-xs font-medium cursor-pointer">
                          {t('platforms')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-bouys" checked={showBouys} onCheckedChange={setShowBouys} />
                        <Label htmlFor="show-bouys" className="text-xs font-medium cursor-pointer">
                          {t('monobuoys')}
                        </Label>
                      </div>

                      <Separator className="my-2 opacity-30" />

                      <div className="flex items-center space-x-2">
                        <Button
                          variant={playback.isActive && playback.type === 'region' ? 'default' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-8 px-2 text-xs"
                          onClick={handleStartRegionPlayback}
                          disabled={isLoadingRegion}
                        >
                          <LucideRoute className="size-3 mr-2" />
                          {t('region_playback')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Measure Tool */}
            <Button
              variant={showMeasureLine ? 'default' : 'secondary'}
              size="icon"
              className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
              onClick={() => {
                setShowMeasureLine(!showMeasureLine);
                if (!showMeasureLine) setSelectedPanel('measure');
                else if (selectedPanel === 'measure') setSelectedPanel(null);
              }}
            >
              <Calculator className="size-4" />
            </Button>

            {/* Toggle History/Route (Only if machine selected) */}
            {selectedMachineId && (
              <Button
                variant={playback.isActive && playback.type === 'route' ? 'default' : 'secondary'}
                size="icon"
                className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
                onClick={handleStartRoutePlayback}
                disabled={isLoadingHistory}
              >
                <Archive className="size-4" />
              </Button>
            )}
          </div>

          {/* Floating Action Buttons for Details (Bottom Right) */}
          {selectedMachineId && (
            <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-auto">
              <Button
                title={t('details')}
                variant={selectedPanel === 'details' ? 'default' : 'secondary'}
                size="icon"
                className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
                onClick={() => setSelectedPanel(selectedPanel === 'details' ? null : 'details')}
              >
                <BarChart3 className="size-4" />
              </Button>
              <Button
                title={t('crew')}
                variant={selectedPanel === 'crew' ? 'default' : 'secondary'}
                size="icon"
                className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
                onClick={() => setSelectedPanel(selectedPanel === 'crew' ? null : 'crew')}
              >
                <Contact2 className="size-4" />
              </Button>
              <Button
                title={t('consume')}
                variant={selectedPanel === 'consume' ? 'default' : 'secondary'}
                size="icon"
                className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
                onClick={() => setSelectedPanel(selectedPanel === 'consume' ? null : 'consume')}
              >
                <Zap className="size-4" />
              </Button>
              <Button
                title={t('info')}
                variant={selectedPanel === 'info' ? 'default' : 'secondary'}
                size="icon"
                className="shadow-md bg-background/95 backdrop-blur-sm border-primary/10"
                onClick={() => setSelectedPanel(selectedPanel === 'info' ? null : 'info')}
              >
                <Archive className="size-4" />
              </Button>
            </div>
          )}

          {/* Floating Panels */}
          <div className="absolute inset-0 p-4 pointer-events-none overflow-hidden">
            {selectedPanel === 'details' && (selectedMachineId || selectedVoyageId) && (
              <div className="absolute right-4 top-4 bottom-4 pointer-events-auto">
                <FleetDetailsPanel />
              </div>
            )}

            {selectedPanel === 'crew' && selectedMachineId && (
              <div className="absolute left-1/2 bottom-4 -translate-x-1/2 pointer-events-auto">
                <FleetCrewPanel />
              </div>
            )}

            {selectedPanel === 'consume' && selectedMachineId && (
              <div className="absolute left-1/2 bottom-4 -translate-x-1/2 pointer-events-auto">
                <FleetConsumePanel />
              </div>
            )}

            {selectedPanel === 'info' && selectedMachineId && (
              <div className="absolute right-4 top-4 bottom-4 pointer-events-auto">
                <FleetInfoPanel />
              </div>
            )}

            {selectedPanel === 'measure' && showMeasureLine && (
              <div className="absolute right-4 top-4 bottom-4 pointer-events-auto">
                <FleetMeasurePanel />
              </div>
            )}
          </div>

          <PlaybackTimeline />
        </div>
      </CardContent>
    </Card>
  );
}
