import { createFileRoute, Link } from '@tanstack/react-router';
import { DoorOpen, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/permissions/')({
  staticData: {
    title: 'permissions',
    description: 'Hub central de gerenciamento de permissões e controle de acesso. Menu principal para acessar gestão de usuários e perfis de acesso do sistema.',
    tags: ['permissions', 'permissões', 'acesso', 'access', 'roles', 'users', 'menu', 'hub'],
    examplePrompts: ['Quero gerenciar permissões de usuários', 'Acessar configurações de perfis', 'Menu de controle de acesso'],
    relatedRoutes: [
      { path: '/_private/permissions/users', relation: 'child', description: 'Gerenciamento de usuários do sistema' },
      { path: '/_private/permissions/roles', relation: 'child', description: 'Gerenciamento de perfis de acesso' },
    ],
    entities: ['User', 'Role', 'Permission'],
    capabilities: ['Navegar para gestão de usuários', 'Navegar para gestão de perfis'],
  },
  component: PermissionsHubPage,
});

function PermissionsHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('users'),
      description: t('users.permissions.description'),
      icon: Users,
      to: '/permissions/users' as const,
      search: { page: 1, pageSize: 10 },
    },
    {
      title: t('role'),
      description: t('roles.description'),
      icon: DoorOpen,
      to: '/permissions/roles' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('permissions')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="h-full cursor-pointer" asChild>
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
