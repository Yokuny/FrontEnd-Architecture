import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, List, MapPin, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/voyage/')({
  staticData: {
    title: 'voyage.page',
    description:
      'Hub principal do módulo de Gestão de Viagens Marítimas (Voyage). Central de acesso a todas as funcionalidades relacionadas ao planejamento, monitoramento e análise de viagens, incluindo listagem de travels, KPIs de performance, planejador de rotas otimizado e integração de dados de viagem com sensores e sistemas externos.',
    tags: ['voyage', 'viagem', 'travel', 'travessia', 'route', 'rota', 'planning', 'planejamento', 'noon-report', 'eta', 'port-call', 'leg', 'maritime', 'marítimo', 'hub', 'menu'],
    examplePrompts: [
      'Ir para o módulo de viagens',
      'Abrir hub de gestão de voyage',
      'Ver opções de planejamento de rotas marítimas',
      'Acessar lista de travels',
      'Verificar KPIs das viagens',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/voyage/list-travel', relation: 'child', description: 'Listagem e gerenciamento de viagens' },
      { path: '/_private/voyage/kpis-travel', relation: 'child', description: 'KPIs e análises de performance de viagens' },
      { path: '/_private/voyage/route-planner', relation: 'child', description: 'Planejador de rotas otimizado' },
      { path: '/_private/voyage/voyage-integration', relation: 'child', description: 'Integração e monitoramento de dados de viagem' },
      { path: '/_private/esg/indicators-eeoi-cii', relation: 'sibling', description: 'Indicadores EEOI/CII calculados por viagem' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Consumo de combustível por viagem' },
    ],
    entities: ['Voyage', 'Travel', 'Port', 'Route', 'NoonReport', 'Machine', 'Customer'],
    capabilities: [
      'Navegar para listagem de viagens',
      'Acessar KPIs de travel',
      'Planejar rotas marítimas',
      'Visualizar integração de dados',
      'Centralizar gestão de voyages',
      'Monitorar ETAs e distâncias',
    ],
  },
  component: VoyageHubPage,
});

function VoyageHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('voyage.list'),
      description: t('travel') || t('voyage.list'),
      icon: List,
      to: '/voyage/list-travel' as const,
    },
    {
      title: t('voyage.kpis'),
      description: t('travel'),
      icon: BarChart3,
      to: '/voyage/kpis-travel' as const,
    },
    {
      title: t('voyage.integration'),
      description: t('travel') || t('voyage.integration'),
      icon: Network,
      to: '/voyage/voyage-integration' as const,
    },
    {
      title: t('route.planner'),
      description: t('travel'),
      icon: MapPin,
      to: '/voyage/route-planner' as const,
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
