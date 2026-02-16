import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, FileText, LayoutDashboard, Ruler } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/contracts/')({
  component: ContractsHubPage,
  staticData: {
    title: 'contracts.index',
    description:
      'Página principal do módulo de contratos. Serve como hub para navegação entre funcionalidades relacionadas a contratos marítimos, charter parties e documentação contratual.',
    tags: ['contracts', 'contratos', 'charter-party', 'legal', 'maritime-contract', 'hub'],
    examplePrompts: ['Mostrar página principal de contratos', 'Navegar para seção de contratos', 'Ver opções de gestão de contratos'],
    relatedRoutes: [
      { path: '/_private/contracts/contract-list', relation: 'child', description: 'Lista de contratos cadastrados' },
      { path: '/_private/register/contracts', relation: 'alternative', description: 'Cadastro e gestão de contratos' },
    ],
    entities: ['Contract'],
    capabilities: ['Navegação', 'Hub de contratos'],
  },
});

function ContractsHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('contracts.list'),
      description: t('contracts.list.description'),
      icon: FileText,
      to: '/contracts/contract-list' as const,
    },
    {
      title: t('contracts.dashboard.rve'),
      description: t('contracts.dashboard.rve.description'),
      icon: LayoutDashboard,
      to: '/contracts/dashboard-rve' as const,
    },
    {
      title: t('contracts.dashboard.rve.rdo'),
      description: t('contracts.dashboard.rve.rdo.description'),
      icon: BarChart3,
      to: '/contracts/dashboard-rve-rdo' as const,
    },
    {
      title: t('contracts.dashboard.rve.sounding'),
      description: t('contracts.dashboard.rve.sounding.description'),
      icon: Ruler,
      to: '/contracts/dashboard-rve-sounding' as const,
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
