import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, Clock, DollarSign, LayoutDashboard, Target, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/operation/')({
  staticData: {
    title: 'operation',
    description:
      'Hub principal do módulo de Gestão Operacional. Central de acesso a todas as funcionalidades de monitoramento operacional de frota marítima, incluindo análise de downtime, performance de ativos, disponibilidade da frota, metas operacionais, grupos de máquinas e taxa PTAX para custos operacionais.',
    tags: ['operation', 'operação', 'downtime', 'availability', 'disponibilidade', 'fleet', 'frota', 'kpi', 'operational', 'performance', 'hub', 'menu', 'uptime', 'utilization'],
    examplePrompts: [
      'Ir para o módulo operacional',
      'Abrir hub de gestão operacional',
      'Ver opções de monitoramento de frota',
      'Acessar análise de downtime',
      'Verificar disponibilidade da frota',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/operation/downtime', relation: 'child', description: 'Análise de tempo de inatividade' },
      { path: '/_private/operation/operational-asset', relation: 'child', description: 'Performance operacional por ativo' },
      { path: '/_private/operation/operational-fleet', relation: 'child', description: 'Dashboard de disponibilidade da frota' },
      { path: '/_private/operation/groups', relation: 'child', description: 'Gerenciamento de grupos de máquinas' },
      { path: '/_private/operation/goals', relation: 'child', description: 'Metas operacionais e KPIs' },
      { path: '/_private/operation/ptax', relation: 'child', description: 'Gerenciamento de taxa PTAX' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Módulo de consumo de combustível' },
    ],
    entities: ['Machine', 'Downtime', 'OperationalData', 'Goal', 'Group', 'Enterprise', 'PTAX'],
    capabilities: [
      'Navegar para análise de downtime',
      'Acessar performance de ativos',
      'Visualizar dashboard da frota',
      'Gerenciar grupos operacionais',
      'Configurar metas operacionais',
      'Gerenciar taxa PTAX',
      'Centralizar dados operacionais',
    ],
  },
  component: OperationHubPage,
});

function OperationHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('downtime'),
      description: t('operation.downtime.description'),
      icon: Clock,
      to: '/operation/downtime' as const,
    },
    {
      title: t('operational.asset'),
      description: t('operation.operational.asset.description'),
      icon: Activity,
      to: '/operation/operational-asset' as const,
    },
    {
      title: t('operational.fleet'),
      description: t('operation.dashboard.description'),
      icon: LayoutDashboard,
      to: '/operation/operational-fleet' as const,
    },
    {
      title: t('groups'),
      description: t('operation.groups.description'),
      icon: Users,
      to: '/operation/groups' as const,
    },
    {
      title: t('goals'),
      description: t('operation.goals.description'),
      icon: Target,
      to: '/operation/goals' as const,
    },
    {
      title: t('ptax'),
      description: t('operation.ptax.description'),
      icon: DollarSign,
      to: '/operation/ptax' as const,
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
