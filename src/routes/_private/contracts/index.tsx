import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/')({
  component: RouteComponent,
  staticData: {
    title: 'contracts.index',
    description:
      'Página principal do módulo de contratos. Serve como hub para navegação entre funcionalidades relacionadas a contratos marítimos, charter parties e documentação contratual.',
    tags: ['contracts', 'contratos', 'charter-party', 'legal', 'maritime-contract', 'hub'],
    examplePrompts: ['Mostrar página principal de contratos', 'Navegar para seção de contratos', 'Ver opções de gestão de contratos'],
    relatedRoutes: [
      { path: '/_private/contracts/contract-list', relation: 'child', description: 'Lista de contratos cadastrados' },
      { path: '/_private/register/contracts', relation: 'alternative', description: 'Cadastro e gestão de contratos' },
    ],
    entities: ['Contract'],
    capabilities: ['Navegação', 'Hub de contratos'],
  },
});

function RouteComponent() {
  return <div>Hello "/_private/contracts/"!</div>;
}
