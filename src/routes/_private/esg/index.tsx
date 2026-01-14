import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, Flame, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/esg/')({
  component: ESGHubPage,
});

function ESGHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('esg.co2'),
      description: t('esg.co2.description', { defaultValue: 'Monitoramento de emissões de CO₂ e consumo de combustível.' }),
      icon: Flame,
      to: '/esg/consumption-co2' as const,
    },
    {
      title: t('menu.eeoi.cii'),
      description: t('esg.indicators.description', { defaultValue: 'Indicadores de eficiência operacional e conformidade CII.' }),
      icon: BarChart3,
      to: '/esg/indicators-eeoi-cii' as const,
    },
    {
      title: t('esg.fleet'),
      description: t('esg.fleet.description', { defaultValue: 'Visão geral da conformidade CII em toda a frota.' }),
      icon: Ship,
      to: '/esg/cii-fleet' as const,
    },
    {
      title: t('simulator.cii'),
      description: t('esg.simulator.description', { defaultValue: 'Simulação de cenários de conformidade CII para futuras viagens.' }),
      icon: Activity,
      to: '/esg/simulator-cii' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('esg.upper')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="cursor-pointer h-full" asChild>
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
