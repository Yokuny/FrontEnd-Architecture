import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, FileText, LayoutDashboard, MapPin, MonitorCog, Network, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/telemetry/')({
  component: TelemetryHubPage,
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
      title: t('telemetry.performance'),
      description: t('telemetry.performance.description'),
      icon: BarChart3,
      to: '/telemetry/performance' as const,
    },
    {
      title: t('telemetry.list.dashboard'),
      description: t('telemetry.list.dashboard.description'),
      icon: LayoutDashboard,
      to: '/telemetry/list-dashboard' as const,
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
      <CardHeader title={t('telemetry')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="cursor-pointer h-full" asChild>
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
