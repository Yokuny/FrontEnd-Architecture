import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, BarChart3, LayoutDashboard, Network, Timer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/statistics/')({
  component: StatisticsHubPage,
});

function StatisticsHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('tracking.activity'),
      description: t('tracking.activity.description'),
      icon: Activity,
      to: '/statistics/tracking-activity' as const,
    },
    {
      title: t('time.operation'),
      description: t('time.operation.description'),
      icon: Timer,
      to: '/statistics/time-operation' as const,
    },
    {
      title: t('rve.dashboard'),
      description: t('rve.dashboard.description'),
      icon: LayoutDashboard,
      to: '/statistics/rve-dashboard' as const,
    },
    {
      title: t('kpis.cmms'),
      description: t('kpis.cmms.description'),
      icon: BarChart3,
      to: '/statistics/kpis-cmms' as const,
    },
    {
      title: t('integration'),
      description: t('integration.description'),
      icon: Network,
      to: '/statistics/integration' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('statistics')} />
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
