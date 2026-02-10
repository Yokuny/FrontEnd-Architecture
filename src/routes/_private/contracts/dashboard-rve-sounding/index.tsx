import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve-sounding/')({
  beforeLoad: () => {
    throw redirect({
      to: '/consumption/rve-sounding',
    });
  },
  staticData: {
    title: 'contracts.rve-sounding',
    description:
      'Rota de redirecionamento para dashboard RVE com Sounding (medição de tanques). Redireciona para o módulo de consumo onde relatórios de viagem com dados de sondagem de combustível são gerenciados.',
    tags: ['rve', 'sounding', 'contracts', 'contratos', 'fuel-measurement', 'tank-sounding', 'voyage-report', 'redirect', 'consumption'],
    examplePrompts: ['Ver dashboard RVE com sounding', 'Acessar relatórios de medição de tanques', 'Consultar RVE com dados de sondagem'],
    relatedRoutes: [
      { path: '/_private/contracts', relation: 'parent', description: 'Hub de contratos' },
      { path: '/_private/consumption/rve-sounding', relation: 'alternative', description: 'Destino do redirecionamento - dashboard RVE-Sounding' },
    ],
    entities: ['RVE', 'Sounding', 'VoyageReport'],
    capabilities: ['Redirecionamento automático para medição de combustível'],
  },
});
