import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, ClipboardList, Contact } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/service-management/')({
  component: ServiceManagementHubPage,
  staticData: {
    title: 'service.management',
    description:
      'Hub central para gestão de serviços externos (FAS - Field Service), incluindo ordens de serviço de campo, analytics de serviços prestados e gerenciamento de contatos de fornecedores',
    tags: ['service', 'serviço', 'field-service', 'fas', 'hub', 'menu', 'os', 'work-order', 'external', 'contractor'],
    examplePrompts: [
      'Mostrar todas as ordens de serviço externas',
      'Ver analytics de serviços de campo',
      'Gerenciar contatos de fornecedores de serviços',
      'Acessar módulo de gestão de serviços',
    ],
    relatedRoutes: [
      { path: '/_private/service-management/fas', relation: 'child', description: 'Listagem de FAS' },
      { path: '/_private/service-management/fas-analytics', relation: 'child', description: 'Analytics de serviços' },
      { path: '/_private/service-management/fas-contacts', relation: 'child', description: 'Contatos de fornecedores' },
    ],
    entities: ['WorkOrder', 'ServiceProvider', 'Contractor', 'FAS'],
    capabilities: ['Navegar módulo de serviços', 'Acessar FAS', 'Acessar analytics', 'Acessar contatos'],
  },
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
      <CardHeader />
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
