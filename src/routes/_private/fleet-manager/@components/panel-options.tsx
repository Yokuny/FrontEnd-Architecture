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
          <ItemTitle className="font-semibold text-[10px] uppercase tracking-wider">{t('map')}</ItemTitle>
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
            <div key={theme.value} className="flex cursor-pointer items-center space-x-2 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50">
              <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} />
              <Label htmlFor={`theme-${theme.value}`} className="flex-1 cursor-pointer text-xs">
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
          <ItemTitle className="font-semibold text-[10px] uppercase tracking-wider">{t('nautical.chart')}</ItemTitle>
        </ItemHeader>
        <RadioGroup value={nauticalChart} onValueChange={(val: any) => setNauticalChart(val)} className="grid grid-cols-2 gap-2">
          {charts.map((chart) => (
            <div key={chart.value} className="flex cursor-pointer items-center space-x-2 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50">
              <RadioGroupItem value={chart.value} id={`chart-${chart.value}`} />
              <Label htmlFor={`chart-${chart.value}`} className="flex-1 cursor-pointer text-xs">
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
          <ItemTitle className="font-semibold text-[10px] uppercase tracking-wider">{t('details')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="px-1">
          <div className="flex items-center space-x-2">
            <Checkbox id="show-geofences" checked={showGeofences} onCheckedChange={toggleShowGeofences} />
            <Label htmlFor="show-geofences" className="cursor-pointer font-medium text-xs">
              {t('geofences')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-platforms" checked={showPlatforms} onCheckedChange={setShowPlatforms} />
            <Label htmlFor="show-platforms" className="cursor-pointer font-medium text-xs">
              {t('platforms')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-bouys" checked={showBouys} onCheckedChange={setShowBouys} />
            <Label htmlFor="show-bouys" className="cursor-pointer font-medium text-xs">
              {t('monobuoys')}
            </Label>
          </div>
          {showBouys && (
            <div className="slide-in-from-left-2 fade-in ml-6 flex animate-in items-center space-x-2 duration-200">
              <Checkbox id="show-near-bouys" checked={showVesselsNearBouys} onCheckedChange={setShowVesselsNearBouys} />
              <Label htmlFor="show-near-bouys" className="cursor-pointer text-[11px] text-muted-foreground">
                {t('vessels.near.buoy')}
              </Label>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex items-center space-x-2">
            <Checkbox id="show-name" checked={showNames} onCheckedChange={toggleShowNames} />
            <Label htmlFor="show-name" className="cursor-pointer font-medium text-xs">
              {t('name')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-code" checked={showCodes} onCheckedChange={toggleShowCodes} />
            <Label htmlFor="show-code" className="cursor-pointer font-medium text-xs">
              {t('code')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-name-fence" checked={showNameFence} onCheckedChange={setShowNameFence} />
            <Label htmlFor="show-name-fence" className="cursor-pointer font-medium text-xs">
              {t('details.geofence')}
            </Label>
          </div>
        </ItemContent>
      </Item>

      {/* Fleet Status */}
      <Item variant="outline" className="flex-col items-stretch p-4">
        <ItemHeader>
          <Palette className="size-3.5" />
          <ItemTitle className="font-semibold text-[10px] uppercase tracking-wider">{t('fleet')}</ItemTitle>
        </ItemHeader>
        <ItemContent className="px-1">
          <div className="flex items-center space-x-2">
            <Checkbox id="status-nav" checked={isNavigationIndicator} onCheckedChange={setIsNavigationIndicator} />
            <Label htmlFor="status-nav" className="cursor-pointer font-medium text-xs">
              {t('view.status.navigation')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-op" checked={isOperationIndicator} onCheckedChange={setIsOperationIndicator} />
            <Label htmlFor="status-op" className="cursor-pointer font-medium text-xs">
              {t('view.status.operation')}
            </Label>
          </div>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}
