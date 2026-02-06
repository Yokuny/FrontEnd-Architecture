import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, LayoutDashboard, Network, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/statistics/')({
  component: StatisticsHubPage,
  staticData: {
    title: 'statistics.hub',
    description:
      'Hub central de estatísticas e análises. Fornece acesso centralizado a dashboards de KPIs, rastreamento de atividades, tempo de operação, integrações e relatórios RVE para análise de dados da frota.',
    tags: ['statistics', 'estatisticas', 'analytics', 'dashboard', 'kpi', 'hub', 'bi', 'business-intelligence'],
    examplePrompts: ['Acessar hub de estatísticas', 'Ver dashboards de análise', 'Navegar para KPIs e relatórios'],
    relatedRoutes: [
      { path: '/_private/statistics/tracking-activity', relation: 'child', description: 'Rastreamento de atividades dos usuários' },
      { path: '/_private/statistics/time-operation', relation: 'child', description: 'Análise de tempo de operação' },
      { path: '/_private/statistics/rve-dashboard', relation: 'child', description: 'Dashboard de relatórios de viagem' },
      { path: '/_private/statistics/kpis-cmms', relation: 'child', description: 'KPIs do sistema CMMS' },
      { path: '/_private/statistics/integration', relation: 'child', description: 'Status de integrações da frota' },
    ],
    entities: ['Statistics', 'KPI', 'Dashboard'],
    capabilities: ['Navegação centralizada', 'Acesso a dashboards', 'Hub de analytics'],
  },
});

function StatisticsHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('tracking.activity'),
      description: t('tracking.activity.description'),
      icon: Activity,
      to: '/statistics/tracking-activity' as const,
    },
    {
      title: t('time.operation'),
      description: t('time.operation.description'),
      icon: Timer,
      to: '/statistics/time-operation' as const,
    },
    {
      title: t('rve.dashboard'),
      description: t('rve.dashboard.description'),
      icon: LayoutDashboard,
      to: '/statistics/rve-dashboard' as const,
    },
    {
      title: t('kpis.cmms'),
      description: t('kpis.cmms.description'),
      icon: BarChart3,
      to: '/statistics/kpis-cmms' as const,
    },
    {
      title: t('integration'),
      description: t('integration.description'),
      icon: Network,
      to: '/statistics/integration' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('statistics')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
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
