import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, ClipboardList, Contact } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/service-management/')({
  component: ServiceManagementHubPage,
});

function ServiceManagementHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('fas'),
      description: t('fas.description'),
      icon: ClipboardList,
      to: '/service-management/fas' as const,
    },
    {
      title: t('fas.analytics'),
      description: t('fas-analytics.description'),
      icon: BarChart3,
      to: '/service-management/fas-analytics' as const,
    },
    {
      title: t('fas.contacts'),
      description: t('fas-contacts.description'),
      icon: Contact,
      to: '/service-management/fas-contacts' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('service-management')} />
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
