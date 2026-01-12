import { Anchor, Layers, Map as MapIcon, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Item, ItemContent, ItemGroup, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { useMapLayersContext } from '@/components/ui/map';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { MAP_THEMES } from '../@consts/fleet-manager';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

export function FleetOptionsPanel() {
  const { t } = useTranslation();
  // const { idEnterprise } = useEnterpriseFilter();
  const {
    mapTheme,
    setMapTheme,
    showNames,
    toggleShowNames,
    showCodes,
    toggleShowCodes,
    showGeofences,
    toggleShowGeofences,
    showPlatforms,
    setShowPlatforms,
    showBouys,
    setShowBouys,
    showVesselsNearBouys,
    setShowVesselsNearBouys,
    showNameFence,
    setShowNameFence,
    nauticalChart,
    setNauticalChart,
    isNavigationIndicator,
    setIsNavigationIndicator,
    isOperationIndicator,
    setIsOperationIndicator,
  } = useFleetManagerStore();

  const layersContext = useMapLayersContext();

  // const { data: regionData, isLoading: isLoadingRegion } = useRegionPlayback({ idEnterprise });

  // const handleStartRegionPlayback = () => {
  //   if (regionData?.length) {
  //     const startTime = regionData[0][0] * 1000;
  //     const endTime = regionData[regionData.length - 1][0] * 1000;
  //     setPlaybackData(regionData, startTime, endTime);
  //     setPlaybackActive(true, PLAYBACK_TYPES.REGION);
  //   }
  // };

  // import { Slider } from '@/components/ui/slider';
  // const playbackStartTime = playback.isActive ? playback.historyData?.[0]?.[0] * 1000 || 0 : 0;
  // const playbackEndTime = playback.isActive ? playback.historyData?.[playback.historyData.length - 1]?.[0] * 1000 || 0 : 0;

  // {playback.isActive && (
  //         // TODO: move to playback panel
  //   <div className="space-y-3 pt-4 border-t border-dashed">
  //     <ItemHeader>
  //       <ItemMedia>
  //         <LucideRoute className="size-3.5" />
  //       </ItemMedia>
  //       <ItemTitle className="uppercase text-[10px] font-semibold tracking-wider">{t('playback')}</ItemTitle>
  //     </ItemHeader>
  //     <div className="px-1">
  //       <Slider
  //         value={[playback.currentTime]}
  //         min={playbackStartTime}
  //         max={playbackEndTime}
  //         step={1000}
  //         onValueChange={([val]: number[]) => setPlaybackTime(val)}
  //         className="py-2 cursor-pointer"
  //       />
  //     </div>
  //   </div>
  // )}

  // TOdo outro processo
  // <div className="flex items-center space-x-2">
  //   <Button
  //     variant={playback.isActive && playback.type === PLAYBACK_TYPES.REGION ? 'default' : 'ghost'}
  //     size="sm"
  //     className="w-full justify-start h-8 px-2 text-xs"
  //     onClick={handleStartRegionPlayback}
  //     disabled={isLoadingRegion}
  //   >
  //     <LucideRoute className="size-3 mr-2" />
  //     {t('region_playback')}
  //   </Button>
  // </div>

  const themes = [
    { value: MAP_THEMES.DEFAULT, label: t('default') },
    { value: MAP_THEMES.SMOOTH_DARK, label: t('smooth.dark') },
    { value: MAP_THEMES.EARTH, label: t('earth') },
    { value: MAP_THEMES.RIVERS, label: t('rivers') },
    { value: MAP_THEMES.SIMPLE, label: t('simple') },
    { value: MAP_THEMES.PREMIUM, label: 'Premium' },
  ];

  const charts = [
    { value: 'none', label: t('empty') },
    { value: 'navtor', label: 'Navtor' },
    { value: 'cmap', label: 'C-MAP' },
    { value: 'cmap_relief', label: 'C-MAP Relief' },
    { value: 'cmap_dark', label: 'C-MAP Night' },
    { value: 'nav', label: 'NAV' },
  ];

  return (
    <ItemGroup className="p-4">
      {/* Map Themes */}
      <Item variant="outline" className="flex-col items-stretch p-4">
        <ItemHeader>
          <MapIcon className="size-3.5" />
          <ItemTitle className="uppercase text-[10px] font-semibold tracking-wider">{t('map')}</ItemTitle>
        </ItemHeader>
        <RadioGroup
          value={mapTheme}
          onValueChange={(val: any) => {
            setMapTheme(val);
            layersContext?.setSelectedTileLayer(val);
          }}
          className="grid grid-cols-2 gap-2"
        >
          {themes.map((theme) => (
            <div key={theme.value} className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} />
              <Label htmlFor={`theme-${theme.value}`} className="text-xs cursor-pointer flex-1">
                {theme.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Item>

      {/* Nautical Charts */}
      <Item variant="outline" className="flex-col items-stretch p-4">
        <ItemHeader>
          <Anchor className="size-3.5" />
          <ItemTitle className="uppercase text-[10px] font-semibold tracking-wider">{t('nautical.chart')}</ItemTitle>
        </ItemHeader>
        <RadioGroup value={nauticalChart} onValueChange={(val: any) => setNauticalChart(val)} className="grid grid-cols-2 gap-2">
          {charts.map((chart) => (
            <div key={chart.value} className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={chart.value} id={`chart-${chart.value}`} />
              <Label htmlFor={`chart-${chart.value}`} className="text-xs cursor-pointer flex-1">
                {chart.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Item>

      {/* Details / Overlays */}
      <Item variant="outline" className="flex-col items-stretch p-4">
        <ItemHeader>
          <Layers className="size-3.5" />
          <ItemTitle className="uppercase text-[10px] font-semibold tracking-wider">{t('details')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="px-1">
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
          {showBouys && (
            <div className="flex items-center space-x-2 ml-6 animate-in slide-in-from-left-2 fade-in duration-200">
              <Checkbox id="show-near-bouys" checked={showVesselsNearBouys} onCheckedChange={setShowVesselsNearBouys} />
              <Label htmlFor="show-near-bouys" className="text-[11px] text-muted-foreground cursor-pointer">
                {t('vessels.near.buoy')}
              </Label>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex items-center space-x-2">
            <Checkbox id="show-name" checked={showNames} onCheckedChange={toggleShowNames} />
            <Label htmlFor="show-name" className="text-xs font-medium cursor-pointer">
              {t('name')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-code" checked={showCodes} onCheckedChange={toggleShowCodes} />
            <Label htmlFor="show-code" className="text-xs font-medium cursor-pointer">
              {t('code')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-name-fence" checked={showNameFence} onCheckedChange={setShowNameFence} />
            <Label htmlFor="show-name-fence" className="text-xs font-medium cursor-pointer">
              {t('details.geofence')}
            </Label>
          </div>
        </ItemContent>
      </Item>

      {/* Fleet Status */}
      <Item variant="outline" className="flex-col items-stretch p-4">
        <ItemHeader>
          <Palette className="size-3.5" />
          <ItemTitle className="uppercase text-[10px] font-semibold tracking-wider">{t('fleet')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="px-1">
          <div className="flex items-center space-x-2">
            <Checkbox id="status-nav" checked={isNavigationIndicator} onCheckedChange={setIsNavigationIndicator} />
            <Label htmlFor="status-nav" className="text-xs font-medium cursor-pointer">
              {t('view.status.navigation')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-op" checked={isOperationIndicator} onCheckedChange={setIsOperationIndicator} />
            <Label htmlFor="status-op" className="text-xs font-medium cursor-pointer">
              {t('view.status.operation')}
            </Label>
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
