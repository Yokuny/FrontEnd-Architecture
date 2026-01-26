import { Map as BaseMap, MapLayers, MapLayersControl, MapTileLayer } from '@/components/ui/map';
import { VoyageRoute } from './VoyageRoute';

export function MapVoyage() {
  return (
    <div className="relative size-full overflow-hidden">
      <BaseMap center={[0, 0]} zoom={3} maxZoom={17} className="size-full">
        <MapLayers defaultTileLayer="default">
          <MapTileLayer name="default" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapTileLayer name="smoothdark" url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <MapTileLayer name="earth" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          <MapTileLayer
            name="rivers"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
          />
          <MapTileLayer
            name="simple"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
          />
          <MapTileLayer name="premium" url={`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAP_TILER}`} attribution="&copy; Maptiler" />

          <MapLayersControl />
          <VoyageRoute />
        </MapLayers>
      </BaseMap>
    </div>
  );
}
