import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart2, Clock, FileText, Gauge, GitCompare, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/consumption/')({
  component: ConsumoHubPage,
});

function ConsumoHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('consumption.daily'),
      description: t('consumption.daily.description'),
      icon: BarChart2,
      to: '/consumption/daily' as const,
    },
    {
      title: t('reports'),
      description: t('reports.description'),
      icon: Gauge,
      to: '/consumption/relatorio' as const,
    },
    {
      title: t('consumption.time.operation'),
      description: t('consumption.time.operation.description'),
      icon: Clock,
      to: '/consumption/time-operation' as const,
    },
    {
      title: t('consumption.comparative'),
      description: t('consumption.comparative.description'),
      icon: GitCompare,
      to: '/consumption/comparative' as const,
    },
    {
      title: t('consumption.rve.rdo'),
      description: t('consumption.rve.rdo.description'),
      icon: FileText,
      to: '/consumption/rve-rdo' as const,
    },
    {
      title: t('consumption.rve.sounding'),
      description: t('consumption.rve.sounding.description'),
      icon: TrendingUp,
      to: '/consumption/rve-sounding' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('consumption')} />
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
