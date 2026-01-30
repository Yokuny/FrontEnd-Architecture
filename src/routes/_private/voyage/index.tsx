import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, List, MapPin, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/voyage/')({
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
      <CardHeader title={t('travel')} />
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
