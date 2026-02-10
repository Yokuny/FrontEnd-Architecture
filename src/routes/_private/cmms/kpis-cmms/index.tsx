import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/cmms/kpis-cmms/')({
  staticData: {
    title: 'kpis.cmms',
    description:
      'Redirecionamento para KPIs e indicadores de performance de manutenção CMMS. Esta página redireciona automaticamente para o módulo de estatísticas onde os KPIs de manutenção são consolidados.',
    tags: ['cmms', 'kpi', 'indicators', 'indicadores', 'performance', 'maintenance', 'manutenção', 'redirect', 'statistics'],
    examplePrompts: ['Ver KPIs de manutenção CMMS', 'Indicadores de performance de manutenção', 'Estatísticas de CMMS'],
    relatedRoutes: [
      { path: '/_private/cmms', relation: 'parent', description: 'Hub CMMS' },
      { path: '/_private/statistics/kpis-cmms', relation: 'alternative', description: 'KPIs CMMS (destino do redirect)' },
    ],
    entities: ['KPI', 'Maintenance', 'Statistics'],
    capabilities: ['Redirecionar para KPIs de manutenção nas estatísticas'],
  },
  beforeLoad: () => {
    throw redirect({
      to: '/statistics/kpis-cmms',
    });
  },
});
