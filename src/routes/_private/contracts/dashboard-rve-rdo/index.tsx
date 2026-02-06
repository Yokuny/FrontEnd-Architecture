import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/dashboard-rve-rdo/')({
  beforeLoad: () => {
    throw redirect({
      to: '/consumption/rve-rdo',
    });
  },
  staticData: {
    title: 'contracts.rve-rdo',
    description:
      'Rota de redirecionamento para dashboard RVE-RDO (Relatório de Viagem Eletrônico com Registro Diário de Operações). Redireciona para o módulo de consumo onde os relatórios operacionais contratuais são gerenciados.',
    tags: ['rve', 'rdo', 'contracts', 'contratos', 'daily-operations', 'voyage-report', 'redirect', 'consumption'],
    examplePrompts: ['Ver dashboard RVE-RDO contratual', 'Acessar relatórios de operação diária', 'Consultar RVE com RDO'],
    relatedRoutes: [
      { path: '/_private/contracts', relation: 'parent', description: 'Hub de contratos' },
      { path: '/_private/consumption/rve-rdo', relation: 'alternative', description: 'Destino do redirecionamento - dashboard RVE-RDO' },
    ],
    entities: ['RVE', 'RDO', 'VoyageReport'],
    capabilities: ['Redirecionamento automático para consumo operacional'],
  },
});
