import { createFileRoute, Link } from '@tanstack/react-router';
import { Activity, CalendarClock, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/maintenance/')({
  component: MaintenanceHubPage,
});

function MaintenanceHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('monitoring.plan.maintenance'),
      description: t('monitoring.plan.maintenance.description'),
      icon: CalendarClock,
      to: '/maintenance/monitoring-plans' as const,
      search: { page: 1, size: 10 },
    },
    {
      title: t('monitoring.wear.part'),
      description: t('monitoring.wear.part.description'),
      icon: Activity,
      to: '/maintenance/monitoring-wear' as const,
      search: { page: 1, size: 10 },
    },
    {
      title: t('done.os'),
      description: t('done.os.description'),
      icon: CheckSquare,
      to: '/maintenance/list-os-done' as const,
      search: { page: 1, size: 10 },
    },
  ];

  return (
    <Card>
      <CardHeader title={t('maintenance')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer bg-card transition-colors hover:bg-muted/50" asChild>
            <Link to={item.to} search={item.search}>
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
