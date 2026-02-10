import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, FileText, LayoutDashboard, MapPin, MonitorCog, Network, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/telemetry/')({
  component: TelemetryHubPage,
  staticData: {
    title: 'telemetry.hub',
    description:
      'Hub central de telemetria e IoT. Fornece acesso centralizado a dashboards de dados de sensores em tempo real, dataloggers, performance, painéis de frota, heatmaps, HMI remoto e requisições de dados históricos.',
    tags: ['telemetry', 'telemetria', 'iot', 'sensors', 'sensores', 'real-time', 'tempo-real', 'hub', 'dashboard', 'monitoring'],
    examplePrompts: ['Acessar hub de telemetria', 'Ver dashboards de sensores IoT', 'Navegar para monitoramento em tempo real'],
    relatedRoutes: [
      { path: '/_private/telemetry/datalogger', relation: 'child', description: 'Visualização de dados históricos de sensores' },
      { path: '/_private/telemetry/performance', relation: 'child', description: 'Análise de performance com scatter plots' },
      { path: '/_private/telemetry/fleet-panel', relation: 'child', description: 'Painel da frota com dados em tempo real' },
      { path: '/_private/telemetry/remote-ihm', relation: 'child', description: 'Interface HMI remota' },
      { path: '/_private/telemetry/heatmap-fleet', relation: 'child', description: 'Heatmap de status da frota' },
      { path: '/_private/telemetry/heatmap-panel', relation: 'child', description: 'Painel de heatmap consolidado' },
      { path: '/_private/telemetry/buoys-dwell-time', relation: 'child', description: 'Tempo de permanência em boias' },
      { path: '/_private/telemetry/download-data-asset-request', relation: 'child', description: 'Requisições de download de dados' },
      { path: '/_private/telemetry/diagram-list', relation: 'child', description: 'Lista de diagramas' },
    ],
    entities: ['Sensor', 'Telemetry', 'Dashboard'],
    capabilities: ['Navegação centralizada', 'Acesso a dashboards IoT', 'Hub de telemetria'],
  },
});

function TelemetryHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('telemetry.datalogger'),
      description: t('telemetry.datalogger.description'),
      icon: Activity,
      to: '/telemetry/datalogger' as const,
    },
    {
      title: t('performance'),
      description: t('telemetry.performance.description'),
      icon: BarChart3,
      to: '/telemetry/performance' as const,
    },
    {
      title: t('fleet.panel'),
      description: t('telemetry.fleet-panel.description'),
      icon: LayoutDashboard,
      to: '/telemetry/fleet-panel' as const,
    },
    {
      title: t('telemetry.remote.ihm'),
      description: t('telemetry.remote.ihm.description'),
      icon: MonitorCog,
      to: '/telemetry/remote-ihm' as const,
    },
    {
      title: t('telemetry.heatmap.fleet'),
      description: t('telemetry.heatmap.fleet.description'),
      icon: MapPin,
      to: '/telemetry/heatmap-fleet' as const,
    },
    {
      title: t('telemetry.heatmap.panel'),
      description: t('telemetry.heatmap.panel.description'),
      icon: BarChart3,
      to: '/telemetry/heatmap-panel' as const,
    },
    {
      title: t('telemetry.buoys.dwell.time'),
      description: t('telemetry.buoys.dwell.time.description'),
      icon: Timer,
      to: '/telemetry/buoys-dwell-time' as const,
    },
    {
      title: t('telemetry.download.data.asset.request'),
      description: t('telemetry.download.data.asset.request.description'),
      icon: FileText,
      to: '/telemetry/download-data-asset-request' as const,
    },
    {
      title: t('telemetry.diagram.list'),
      description: t('telemetry.diagram.list.description'),
      icon: Network,
      to: '/telemetry/diagram-list' as const,
    },
  ];

  return (
    <Card>
      <CardHeader />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer" asChild>
            <Link to={item.to}>
              <ItemMedia variant="icon">
                <item.icon className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </CardContent>
    </Card>
  );
}
