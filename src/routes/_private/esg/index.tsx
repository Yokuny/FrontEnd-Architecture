import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, Flame, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/esg/')({
  staticData: {
    title: 'esg',
    description:
      'Hub principal do módulo ESG (Environmental, Social, and Governance). Central de acesso a todas as funcionalidades de conformidade ambiental marítima, incluindo monitoramento de emissões de CO₂, cálculo de indicadores de eficiência energética (EEOI/CII), rating da frota e simulação de compliance com regulamentações IMO MARPOL Annex VI.',
    tags: ['esg', 'environmental', 'ambiental', 'social', 'governance', 'governança', 'compliance', 'imo', 'marpol', 'cii', 'eeoi', 'co2', 'emissions', 'emissões', 'hub', 'menu'],
    examplePrompts: [
      'Ir para o módulo ESG',
      'Abrir hub de conformidade ambiental',
      'Ver opções de monitoramento de emissões',
      'Acessar indicadores IMO',
      'Verificar compliance marítimo',
    ],
    searchParams: [],
    relatedRoutes: [
      { path: '/_private/esg/consumption-co2', relation: 'child', description: 'Monitoramento de emissões de CO₂' },
      { path: '/_private/esg/indicators-eeoi-cii', relation: 'child', description: 'Indicadores EEOI e CII por viagem' },
      { path: '/_private/esg/cii-fleet', relation: 'child', description: 'Rating CII da frota (A-E)' },
      { path: '/_private/esg/simulator-cii', relation: 'child', description: 'Simulador de CII para planejamento' },
      { path: '/_private/consumption', relation: 'sibling', description: 'Módulo de consumo de combustível' },
    ],
    entities: ['ConsumptionData', 'Machine', 'Enterprise', 'CII', 'EEOI', 'Voyage', 'EmissionsData'],
    capabilities: [
      'Navegar para monitoramento de CO₂',
      'Acessar indicadores de eficiência energética',
      'Visualizar rating CII da frota',
      'Simular cenários de CII',
      'Centralizar dados de compliance IMO',
      'Verificar conformidade com MARPOL Annex VI',
    ],
  },
  component: ESGHubPage,
});

function ESGHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('esg.co2'),
      description: t('esg.co2.description'),
      icon: Flame,
      to: '/esg/consumption-co2' as const,
    },
    {
      title: t('menu.eeoi.cii'),
      description: t('esg.indicators.description'),
      icon: BarChart3,
      to: '/esg/indicators-eeoi-cii' as const,
    },
    {
      title: t('esg.fleet'),
      description: t('esg.fleet.description'),
      icon: Ship,
      to: '/esg/cii-fleet' as const,
    },
    {
      title: t('simulator.cii'),
      description: t('esg.simulator.description'),
      icon: Activity,
      to: '/esg/simulator-cii' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('esg')} />
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
