import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Map as BaseMap, MapLayers, MapLayersControl, MapTileLayer } from '@/components/ui/map';
import { VoyageRoute } from './@components/detailes-route';
import { AssetsPanel } from './@components/panel-of-assets';
import { VoyageDetailsPanel } from './@components/panel-voyage-details';
import { VoyageSidebar } from './@components/panel-voyages';

const searchSchema = z.object({
  idMachine: z.string().optional(),
  search: z.string().optional(),
  code: z.string().optional(),
});

export const Route = createFileRoute('/_private/voyage/voyage-integration/')({
  staticData: {
    title: 'voyage.integration',
    description:
      'Integração e monitoramento em tempo real de dados de viagens marítimas. Visualiza no mapa a posição atual das embarcações, rotas percorridas, Noon Reports, Port Calls e eventos de viagem. Permite selecionar ativos e viagens específicas para análise detalhada de legs, consumo de bunker por trecho, ETAs atualizadas, ROB (Remaining On Board) e desvios de rota. Integra dados de sensores, sistemas externos e relatórios de bordo para consolidação de informações de voyage.',
    tags: [
      'integration',
      'integração',
      'voyage',
      'viagem',
      'monitoring',
      'monitoramento',
      'real-time',
      'tempo-real',
      'map',
      'mapa',
      'noon-report',
      'port-call',
      'porto',
      'leg',
      'trecho',
      'position',
      'posição',
      'tracking',
      'rastreamento',
      'bunker',
      'rob',
      'eta',
      'sensor',
      'data',
      'dados',
    ],
    examplePrompts: [
      'Monitorar viagens em tempo real',
      'Ver posição atual das embarcações',
      'Visualizar rotas no mapa',
      'Verificar Noon Reports de uma viagem',
      'Acompanhar Port Calls',
      'Ver detalhes de legs por embarcação',
      'Filtrar viagens por código',
    ],
    searchParams: [
      { name: 'idMachine', description: 'ID da embarcação para filtrar viagens', type: 'string' },
      { name: 'search', description: 'Termo de busca para filtrar', type: 'string' },
      { name: 'code', description: 'Código específico da viagem', type: 'string' },
    ],
    relatedRoutes: [
      { path: '/_private/voyage', relation: 'parent', description: 'Hub de viagens' },
      { path: '/_private/voyage/list-travel', relation: 'sibling', description: 'Listagem de viagens' },
      { path: '/_private/voyage/kpis-travel', relation: 'sibling', description: 'KPIs de viagem' },
      { path: '/_private/fleet-manager', relation: 'sibling', description: 'Gestão de frota' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Consumo de combustível' },
    ],
    entities: ['Voyage', 'Travel', 'Machine', 'Port', 'NoonReport', 'PortCall', 'Leg', 'Sensor', 'Route'],
    capabilities: [
      'Visualizar embarcações no mapa',
      'Selecionar ativo para análise',
      'Ver viagens por embarcação',
      'Visualizar rota completa',
      'Detalhar legs de viagem',
      'Monitorar Noon Reports',
      'Acompanhar Port Calls',
      'Verificar ROB atual',
      'Visualizar ETAs atualizadas',
      'Filtrar por código de viagem',
      'Trocar camadas de mapa',
      'Integrar dados de sensores',
    ],
  },
  component: VoyageIntegrationPage,
  validateSearch: (search) => searchSchema.parse(search),
});

function VoyageIntegrationPage() {
  const { idMachine } = Route.useSearch();

  return (
    <Card className="flex h-[98vh] overflow-hidden p-0">
      <CardContent className="relative flex h-full w-full p-0">
        <div className="flex h-full w-full overflow-hidden">
          {/* Asset Selection / Voyages Sidebar */}
          {idMachine ? <VoyageSidebar /> : <AssetsPanel />}

          {/* Details Panel Overlay (managed via absolute positioning in component) */}
          <VoyageDetailsPanel />

          {/* Map Area */}
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
        </div>
      </CardContent>
    </Card>
  );
}
