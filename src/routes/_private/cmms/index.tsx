import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, ClipboardCheck, Network } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/cmms/')({
  component: CMMSHubPage,
});

function CMMSHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('kpis.cmms'),
      description: t('kpis.cmms.description'),
      icon: BarChart3,
      to: '/cmms/kpis-cmms' as const,
    },
    {
      title: t('filled-form-cmms'),
      description: t('filled-form-cmms.description'),
      icon: ClipboardCheck,
      to: '/cmms/filled-form-cmms' as const,
    },
    {
      title: t('telemetry.diagram.list'),
      description: t('telemetry.diagram.list.description') || t('telemetry.diagram.list'),
      icon: Network,
      to: '/cmms/diagram-list' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('cmms')} />
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
