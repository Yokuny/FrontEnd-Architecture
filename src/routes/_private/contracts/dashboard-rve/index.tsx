import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve/')({
  beforeLoad: () => {
    throw redirect({
      to: '/statistics/rve-dashboard',
    });
  },
  staticData: {
    title: 'contracts.rve-dashboard',
    description:
      'Rota de redirecionamento para dashboard RVE (Relatório de Viagem Eletrônico). Redireciona para o módulo de estatísticas onde métricas e análises de viagens contratuais são visualizadas.',
    tags: ['rve', 'contracts', 'contratos', 'voyage-report', 'dashboard', 'statistics', 'redirect'],
    examplePrompts: ['Ver dashboard RVE contratual', 'Acessar estatísticas de viagens', 'Consultar relatórios de viagem eletrônicos'],
    relatedRoutes: [
      { path: '/_private/contracts', relation: 'parent', description: 'Hub de contratos' },
      { path: '/_private/statistics/rve-dashboard', relation: 'alternative', description: 'Destino do redirecionamento - dashboard RVE em estatísticas' },
    ],
    entities: ['RVE', 'VoyageReport'],
    capabilities: ['Redirecionamento automático para estatísticas de viagens'],
  },
});
