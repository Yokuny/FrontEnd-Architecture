import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, CalendarClock, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/maintenance/')({
  staticData: {
    title: 'maintenance',
    description:
      'Hub principal do módulo de Manutenção (PMS - Planned Maintenance System). Central de acesso ao sistema de gerenciamento de manutenção marítima, incluindo monitoramento de planos preventivos, acompanhamento de desgaste de peças e histórico de Ordens de Serviço (OS) concluídas. Essencial para gestão de manutenção preventiva, corretiva e preditiva da frota.',
    tags: [
      'maintenance',
      'manutenção',
      'pms',
      'planned-maintenance',
      'work-order',
      'os',
      'ordem-serviço',
      'preventive',
      'preventiva',
      'corrective',
      'corretiva',
      'predictive',
      'preditiva',
      'hub',
      'menu',
    ],
    examplePrompts: [
      'Ir para o módulo de manutenção',
      'Abrir hub de manutenção',
      'Ver opções de PMS',
      'Acessar sistema de manutenção',
      'Verificar planos de manutenção preventiva',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/maintenance/monitoring-plans', relation: 'child', description: 'Monitoramento de planos de manutenção preventiva' },
      { path: '/_private/maintenance/monitoring-wear', relation: 'child', description: 'Monitoramento de desgaste de peças' },
      { path: '/_private/maintenance/list-os-done', relation: 'child', description: 'Histórico de Ordens de Serviço concluídas' },
    ],
    entities: ['MaintenancePlan', 'WorkOrder', 'Machine', 'Part', 'Enterprise', 'Equipment'],
    capabilities: [
      'Navegar para monitoramento de planos de manutenção',
      'Acessar monitoramento de desgaste de peças',
      'Visualizar histórico de OS concluídas',
      'Centralizar gestão de manutenção preventiva',
      'Gerenciar work orders da frota',
      'Controlar spare parts e equipamentos',
    ],
  },
  component: MaintenanceHubPage,
});

function MaintenanceHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('monitoring.plan.maintenance'),
      description: t('monitoring.plan.maintenance.description'),
      icon: CalendarClock,
      to: '/maintenance/monitoring-plans' as const,
      search: { page: 1, size: 10 },
    },
    {
      title: t('monitoring.wear.part'),
      description: t('monitoring.wear.part.description'),
      icon: Activity,
      to: '/maintenance/monitoring-wear' as const,
      search: { page: 1, size: 10 },
    },
    {
      title: t('done.os'),
      description: t('done.os.description'),
      icon: CheckSquare,
      to: '/maintenance/list-os-done' as const,
      search: { page: 1, size: 10 },
    },
  ];

  return (
    <Card>
      <CardHeader title={t('maintenance')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer bg-card transition-colors hover:bg-muted/50" asChild>
            <Link to={item.to} search={item.search}>
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
