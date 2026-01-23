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
