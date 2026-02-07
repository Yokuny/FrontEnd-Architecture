import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart2, Clock, FileText, Gauge, GitCompare, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/consumption/')({
  staticData: {
    title: 'consume',
    description:
      'Hub principal do módulo de Consumo de Combustível. Página de menu com acesso a todas as funcionalidades relacionadas ao monitoramento, análise e relatórios de consumo de combustível das embarcações da frota. Inclui acesso a consumo diário, relatórios, tempo de operação, comparativos e dashboards RVE/RDO.',
    tags: ['consumption', 'consumo', 'fuel', 'combustível', 'vessel', 'embarcação', 'hub', 'menu', 'dashboard', 'reports', 'relatórios'],
    examplePrompts: ['Ir para o módulo de consumo', 'Abrir o hub de consumo de combustível', 'Ver opções de relatórios de consumo', 'Acessar análise de consumo'],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/consumption/daily', relation: 'child', description: 'Consumo diário por embarcação' },
      { path: '/_private/consumption/relatorio', relation: 'child', description: 'Relatório de consumo detalhado' },
      { path: '/_private/consumption/time-operation', relation: 'child', description: 'Consumo por tempo de operação' },
      { path: '/_private/consumption/comparative', relation: 'child', description: 'Comparativo entre embarcações' },
      { path: '/_private/consumption/rve-rdo', relation: 'child', description: 'Dashboard RVE vs RDO' },
      { path: '/_private/consumption/rve-sounding', relation: 'child', description: 'Dashboard RVE com sounding' },
    ],
    entities: ['ConsumptionData', 'Machine', 'Enterprise'],
    capabilities: [
      'Navegar para consumo diário',
      'Acessar relatórios de consumo',
      'Ver tempo de operação',
      'Comparar embarcações',
      'Acessar dashboards RVE/RDO',
      'Visualizar sounding',
    ],
  },
  component: ConsumoHubPage,
});

function ConsumoHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('consumption.daily'),
      description: t('consumption.daily.description'),
      icon: BarChart2,
      to: '/consumption/daily' as const,
    },
    {
      title: t('reports'),
      description: t('reports.description'),
      icon: Gauge,
      to: '/consumption/relatorio' as const,
    },
    {
      title: t('consumption.time.operation'),
      description: t('consumption.time.operation.description'),
      icon: Clock,
      to: '/consumption/time-operation' as const,
    },
    {
      title: t('consumption.comparative'),
      description: t('consumption.comparative.description'),
      icon: GitCompare,
      to: '/consumption/comparative' as const,
    },
    {
      title: t('dashboard.rve.rdo'),
      description: t('consumption.rve.rdo.description'),
      icon: FileText,
      to: '/consumption/rve-rdo' as const,
    },
    {
      title: t('dashboard.rve.sounding'),
      description: t('consumption.rve.sounding.description'),
      icon: TrendingUp,
      to: '/consumption/rve-sounding' as const,
    },
  ];

  return (
    <Card>
      <CardHeader />
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
