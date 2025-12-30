import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, Droplet, Settings, Ship, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/register/')({
  component: RegisterHubPage,
  beforeLoad: () => ({
    title: 'register',
  }),
});

function RegisterHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('types.user'),
      description: t('types.user.description'),
      icon: Users,
      to: '/register/user-type' as const,
    },
    {
      title: t('types.fuel'),
      description: t('types.fuel.description'),
      icon: Droplet,
      to: '/register/type-fuel' as const,
    },
    {
      title: t('sensors'),
      description: t('sensors.description'),
      icon: Activity,
      to: '/register/sensors' as const,
    },
    {
      title: t('platforms'),
      description: t('platforms.description'),
      icon: Ship,
      to: '/register/platform' as const,
    },
    {
      title: t('maintenance.plans'),
      description: t('maintenance.plans.description'),
      icon: Settings,
      to: '/register/maintenance-plans' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('register')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="bg-card hover:bg-muted/50 transition-colors cursor-pointer h-full" asChild>
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
