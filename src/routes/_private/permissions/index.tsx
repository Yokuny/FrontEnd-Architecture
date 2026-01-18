import { createFileRoute, Link } from '@tanstack/react-router';
import { DoorOpen, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const Route = createFileRoute('/_private/permissions/')({
  component: PermissionsHubPage,
});

function PermissionsHubPage() {
  const { t } = useTranslation();

  const menuItems = [
    {
      title: t('users'),
      description: t('users.permissions.description', { defaultValue: 'Gerencie usuários e suas respectivas permissões de acesso.' }),
      icon: Users,
      to: '/permissions/users' as const,
      search: { page: 1, pageSize: 10 },
    },
    {
      title: t('role'),
      description: t('roles.description', { defaultValue: 'Configure perfis de acesso e agrupe permissões.' }),
      icon: DoorOpen,
      to: '/permissions/roles' as const,
    },
  ];

  return (
    <Card>
      <CardHeader title={t('permissions')} />
      <CardContent className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <Item key={item.to} variant="outline" className="cursor-pointer h-full" asChild>
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
