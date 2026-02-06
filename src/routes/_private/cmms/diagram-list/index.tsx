import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/cmms/diagram-list/')({
  staticData: {
    title: 'telemetry.diagram.list',
    description:
      'Redirecionamento para lista de diagramas de equipamentos e sistemas. Esta página redireciona automaticamente para o módulo de telemetria onde os diagramas são gerenciados.',
    tags: ['cmms', 'diagram', 'diagrama', 'redirect', 'redirecionamento', 'equipment', 'equipamento', 'telemetry'],
    examplePrompts: ['Ver diagramas de equipamentos CMMS', 'Lista de diagramas do sistema', 'Acessar diagramas técnicos'],
    relatedRoutes: [
      { path: '/_private/cmms', relation: 'parent', description: 'Hub CMMS' },
      { path: '/_private/telemetry/diagram-list', relation: 'alternative', description: 'Lista de diagramas (destino do redirect)' },
    ],
    entities: ['Diagram', 'Equipment'],
    capabilities: ['Redirecionar para lista de diagramas na telemetria'],
  },
  beforeLoad: () => {
    throw redirect({
      to: '/telemetry/diagram-list',
      search: {
        page: 0,
        search: undefined,
      },
    });
  },
});
