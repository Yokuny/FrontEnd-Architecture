import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, ClipboardCheck, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/cmms/')({
  staticData: {
    title: 'cmms',
    description:
      'Hub principal do CMMS (Computerized Maintenance Management System). Central de acesso a todas as funcionalidades de gestão informatizada de manutenção, incluindo formulários digitais de inspeção, checklists dinâmicos, diagramas de equipamentos e KPIs de performance de manutenção.',
    tags: ['cmms', 'maintenance', 'manutenção', 'form', 'formulário', 'checklist', 'inspection', 'inspeção', 'kpi', 'digital', 'diagram', 'diagrama', 'hub', 'menu'],
    examplePrompts: [
      'Ir para o módulo CMMS',
      'Abrir hub de gestão de manutenção digital',
      'Ver opções de formulários CMMS',
      'Acessar checklists de inspeção',
      'Verificar KPIs de manutenção',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/cmms/kpis-cmms', relation: 'child', description: 'KPIs e indicadores de performance de manutenção' },
      { path: '/_private/cmms/filled-form-cmms', relation: 'child', description: 'Formulários preenchidos e histórico de inspeções' },
      { path: '/_private/cmms/diagram-list', relation: 'child', description: 'Lista de diagramas de equipamentos' },
      { path: '/_private/maintenance', relation: 'sibling', description: 'Módulo de gestão de manutenção' },
      { path: '/_private/statistics/kpis-cmms', relation: 'redirect', description: 'KPIs CMMS (rota real)' },
      { path: '/_private/telemetry/diagram-list', relation: 'redirect', description: 'Lista de diagramas (rota real)' },
    ],
    entities: ['Form', 'Checklist', 'FormResponse', 'Diagram', 'Inspection', 'MaintenancePlan'],
    capabilities: [
      'Navegar para KPIs de manutenção',
      'Acessar formulários preenchidos',
      'Visualizar diagramas de equipamentos',
      'Gerenciar checklists digitais',
      'Centralizar dados de inspeção',
      'Monitorar performance de manutenção',
    ],
  },
  component: CMMSHubPage,
});

function CMMSHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('kpis.cmms'),
      description: t('kpis.cmms.description'),
      icon: BarChart3,
      to: '/cmms/kpis-cmms' as const,
    },
    {
      title: t('filled.forms'),
      description: t('filled-form-cmms.description'),
      icon: ClipboardCheck,
      to: '/cmms/filled-form-cmms' as const,
    },
    {
      title: t('telemetry.diagram.list'),
      description: t('telemetry.diagram.list.description') || t('telemetry.diagram.list'),
      icon: Network,
      to: '/cmms/diagram-list' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('cmms')} />
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
