import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Circle as LeafletCircle, Polygon as LeafletPolygon, useMap } from 'react-leaflet';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect, FenceSelect, FenceTypeSelect } from '@/components/selects';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  MapDrawCircle,
  MapDrawControl,
  MapDrawDelete,
  MapDrawEdit,
  MapDrawPolygon,
  MapDrawUndo,
  MapLayers,
  MapLayersControl,
  Map as MapRoot,
  MapTileLayer,
  MapZoomControl,
  useLeaflet,
  useMapDrawContext,
} from '@/components/ui/map';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFences } from '@/hooks/use-fences-api';
import type { GeofenceFormData } from '../@interface/geofence.interface';

function MapInitializer({ initialLocation, color }: { initialLocation?: any; color?: string }) {
  const context = useMapDrawContext();
  const map = useMap();
  const { L: Leaflet } = useLeaflet();
  const initialized = useRef(false);

  useEffect(() => {
    if (!context?.featureGroup || !initialLocation || !Leaflet || initialized.current) return;

    if (initialLocation.properties?.radius) {
      // Circle
      const circle = new Leaflet.Circle([initialLocation.geometry.coordinates[1], initialLocation.geometry.coordinates[0]], {
        radius: initialLocation.properties.radius,
        color: color || '#3366FF',
      });
      context.featureGroup.addLayer(circle);
      map.setView([initialLocation.geometry.coordinates[1], initialLocation.geometry.coordinates[0]], 15);
    } else if (initialLocation.coordinates) {
      // Polygon
      const latLngs = initialLocation.coordinates[0].map((coord: any) => [coord[1], coord[0]]);
      const polygon = new Leaflet.Polygon(latLngs, {
        color: color || '#3366FF',
      });
      context.featureGroup.addLayer(polygon);
      map.setView(latLngs[0], 15);
    }
    initialized.current = true;
  }, [context?.featureGroup, initialLocation, Leaflet, map, color]);

  return null;
}

function ReferenceFenceRenderer({ idFence, idEnterprise }: { idFence?: string; idEnterprise?: string }) {
  const { data: fences = [] } = useFences({ idEnterprise });

  if (!idFence || !fences.length) return null;

  const fence = fences.find((f) => f.id === idFence);
  if (!fence || !fence.location) return null;

  const location = fence.location as any;

  if (location.type === 'Polygon' && location.coordinates) {
    const latLngs = location.coordinates[0].map((coord: any) => [coord[1], coord[0]]);
    return <LeafletPolygon positions={latLngs} pathOptions={{ color: fence.color || '#666', fillOpacity: 0.1, dashArray: '5, 5', weight: 1 }} />;
  }

  if (location.properties?.radius && (location.geometry?.coordinates || location.coordinates)) {
    const coords = location.geometry?.coordinates || location.coordinates;
    return (
      <LeafletCircle
        center={[coords[1], coords[0]]}
        radius={location.properties.radius}
        pathOptions={{ color: fence.color || '#666', fillOpacity: 0.1, dashArray: '5, 5', weight: 1 }}
      />
    );
  }

  return null;
}

export function GeofenceForm() {
  const { t } = useTranslation();
  const form = useFormContext<GeofenceFormData>();
  const idEnterprise = form.watch('idEnterprise');
  const idFence = form.watch('idFence');
  const type = form.watch('type');
  const initialLocation = form.getValues('location');
  const color = form.watch('color');

  const timeZones = Array.from({ length: 27 }, (_, i) => i - 12);

  const sections = [
    {
      title: t('general.information'),
      description: t('geofence.general.description'),
      fields: [
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')} *</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('description')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="row-type-code" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FenceTypeSelect
                  mode="single"
                  value={field.value?.value}
                  onChange={(val) => {
                    field.onChange({ value: val });
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('code')} *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('code')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('location.details'),
      description: t('geofence.location.description'),
      fields: [
        <div key="row-city-state" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('city')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder={t('city')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('state.label')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder={t('state.label')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="row-country-tz" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('country')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder={t('country')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="GMT" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz} value={tz.toString()}>
                        GMT {tz >= 0 ? '+' : ''}
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('advanced.settings'),
      description: t('geofence.advanced.description'),
      fields: [
        <FormField
          key="color"
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('color')} *</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="color" {...field} className="h-10 w-20 p-1" />
                  <Input {...field} className="flex-1" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="idFence"
          control={form.control}
          name="idFence"
          render={({ field }) => (
            <FormItem>
              <FenceSelect idEnterprise={idEnterprise} mode="single" value={field.value ?? undefined} onChange={field.onChange} placeholder={t('geofences')} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="link"
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('link')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder={t('link')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="row-checks" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <FormField
            control={form.control}
            name="initializeTravel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('initialize.travel')}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="finalizeTravel"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t('finalize.travel')}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {type?.value === 'port' && (
            <FormField
              control={form.control}
              name="nearestPort"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t('nearest.port')}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>,
      ],
    },
    {
      title: t('map.configuration'),
      description: t('geofence.map.description'),
      layout: 'vertical' as const,
      fields: [
        <div key="map-container" className="h-[600px] w-full overflow-hidden rounded-md border">
          <MapRoot center={[-26.06093, -36.532229]} zoom={5}>
            <MapLayers>
              <MapTileLayer />
              <MapLayersControl />
              <MapZoomControl />
              <MapDrawControl
                onLayersChange={(layers) => {
                  const layer = Object.values(layers.getLayers())[0] as any;
                  if (!layer) {
                    form.setValue('location', null);
                    return;
                  }

                  if (layer.getRadius) {
                    // Circle
                    const latLng = layer.getLatLng();
                    form.setValue('location', {
                      type: 'Polygon',
                      properties: {
                        radius: layer.getRadius(),
                      },
                      geometry: {
                        type: 'Point',
                        coordinates: [latLng.lng, latLng.lat],
                      },
                    });
                  } else if (layer.getLatLngs) {
                    // Polygon
                    const latLngs = layer.getLatLngs()[0] as any[];
                    const coordinates = latLngs.map((ll: any) => [ll.lng, ll.lat]);
                    // Close the polygon
                    coordinates.push(coordinates[0]);
                    form.setValue('location', {
                      type: 'Polygon',
                      coordinates: [coordinates],
                    });
                  }
                }}
              >
                <MapDrawPolygon />
                <MapDrawCircle />
                <MapDrawEdit />
                <MapDrawDelete />
                <MapDrawUndo />
                <MapInitializer initialLocation={initialLocation} color={color} />
                <ReferenceFenceRenderer idFence={idFence ?? undefined} idEnterprise={idEnterprise} />
              </MapDrawControl>
            </MapLayers>
          </MapRoot>
        </div>,
        <FormField
          key="location-message"
          control={form.control}
          name="location"
          render={() => (
            <FormItem>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
