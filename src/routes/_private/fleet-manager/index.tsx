import { createFileRoute, Link } from '@tanstack/react-router';
import { MapIcon, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/fleet-manager/')({
  component: FleetManagerHubPage,
});

function FleetManagerHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('fleet.map'),
      description: t('fleet.map.description', { defaultValue: 'Visualize sua frota em tempo real no mapa.' }),
      icon: MapIcon,
      to: '/fleet-manager/fleet' as const,
    },
    {
      title: t('fleet.wind'),
      description: t('fleet.wind.description', { defaultValue: 'Monitore as condições climáticas e de vento para sua frota.' }),
      icon: Wind,
      to: '/fleet-manager/wind' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('fleet.manager')} />
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
