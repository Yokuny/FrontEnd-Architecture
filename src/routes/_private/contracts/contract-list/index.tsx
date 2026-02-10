import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/contracts/contract-list/')({
  beforeLoad: () => {
    throw redirect({
      to: '/register/contracts',
      search: { page: 1, size: 10, search: undefined },
    });
  },
  staticData: {
    title: 'contracts.list',
    description: 'Rota de redirecionamento para lista de contratos. Redireciona automaticamente para o cadastro de contratos com parâmetros de paginação padrão.',
    tags: ['contracts', 'contratos', 'list', 'lista', 'redirect', 'redirecionamento'],
    examplePrompts: ['Ver lista de contratos', 'Mostrar todos os contratos', 'Acessar página de contratos'],
    searchParams: [
      { name: 'page', type: 'number', description: 'Número da página (padrão: 1)' },
      { name: 'size', type: 'number', description: 'Tamanho da página (padrão: 10)' },
      { name: 'search', type: 'string', description: 'Termo de busca' },
    ],
    relatedRoutes: [
      { path: '/_private/contracts', relation: 'parent', description: 'Hub de contratos' },
      { path: '/_private/register/contracts', relation: 'alternative', description: 'Destino do redirecionamento - cadastro de contratos' },
    ],
    entities: ['Contract'],
    capabilities: ['Redirecionamento automático'],
  },
});
