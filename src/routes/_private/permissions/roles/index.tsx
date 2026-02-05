import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DoorOpen, Globe, Lock, MoreVertical, Pencil, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmpty from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useRoles } from '@/hooks/use-roles-api';
import { cn } from '@/lib/utils';

// import { useHasPermission } from '@/hooks/use-permissions';

export const Route = createFileRoute('/_private/permissions/roles/')({
  staticData: {
    title: 'role',
    description:
      'Página de listagem e gerenciamento de perfis de acesso (roles). Permite visualizar, criar e editar perfis com controle de permissões de páginas, ativos, chatbot e visibilidade.',
    tags: ['roles', 'perfis', 'permissões', 'permissions', 'access', 'acesso', 'control', 'controle'],
    examplePrompts: ['Listar todos os perfis de acesso', 'Criar novo perfil de usuário', 'Ver perfis por empresa', 'Gerenciar roles do sistema'],
    relatedRoutes: [
      { path: '/_private/permissions', relation: 'parent', description: 'Hub de permissões' },
      { path: '/_private/permissions/roles/edit', relation: 'child', description: 'Edição de perfil de acesso' },
      { path: '/_private/permissions/roles/users', relation: 'child', description: 'Usuários do perfil' },
    ],
    entities: ['Role', 'Enterprise', 'Permission'],
    capabilities: [
      'Listar perfis de acesso por empresa',
      'Visualizar visibilidade do perfil (público, privado, limitado)',
      'Criar novo perfil',
      'Editar perfil existente',
      'Ver usuários do perfil',
    ],
  },
  component: ListRolesPage,
});

function ListRolesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idEnterprise } = useEnterpriseFilter();
  const { data: roles, isLoading } = useRoles({
    idEnterprise,
    page: 0,
    size: 20,
  });

  // const hasPermissionAdd = useHasPermission('/add-role');
  // const hasPermissionViewUsers = useHasPermission('/list-role-users');

  const getVisibilityData = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return { icon: Globe, color: 'text-green-500' };
      case 'private':
        return { icon: Lock, color: 'text-red-500' };
      case 'limited':
        return { icon: Users, color: 'text-orange-500' };
      default:
        return { icon: Lock, color: 'text-muted-foreground' };
    }
  };

  return (
    <Card>
      <CardHeader title={t('role')}>
        {/* {hasPermissionAdd && ( */}
        <Button onClick={() => navigate({ to: '/permissions/roles/add' })}>
          <Plus className="mr-2 size-4" />
          {t('new.role')}
        </Button>
        {/* )} */}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : roles && roles.data.length > 0 ? (
          <ItemGroup>
            {roles.data.map((role) => {
              const visibilityData = getVisibilityData(role.visibility);
              const VisibilityIcon = visibilityData.icon;

              return (
                <Item
                  key={role.id}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    // if (hasPermissionAdd) {
                    navigate({
                      to: '/permissions/roles/edit',
                      search: { id: role.id },
                    });
                    // }
                  }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <ItemMedia variant="image">
                      <DoorOpen className="size-5 text-warning" />
                    </ItemMedia>
                    <ItemContent className="gap-0">
                      <ItemTitle className="text-base">{role.description}</ItemTitle>
                      <ItemDescription className="truncate">{role.enterprise?.name || '-'}</ItemDescription>
                    </ItemContent>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 pr-2">
                      <div className="flex items-center gap-1.5">
                        <VisibilityIcon className={cn('size-4', visibilityData.color)} />
                        <ItemDescription className="text-xs capitalize">{t(`visibility.${role.visibility}`)}</ItemDescription>
                      </div>
                    </div>

                    {/* {(hasPermissionAdd || hasPermissionViewUsers) && ( */}
                    <div className="ml-2 flex items-center justify-end border-l pl-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="size-4" />
                            <span className="sr-only">{t('actions')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* {hasPermissionAdd && ( */}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/permissions/roles/edit', search: { id: role.id } });
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                          {/* )} */}
                          {/* {hasPermissionViewUsers && ( */}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/permissions/roles/users', search: { id: role.id } });
                            }}
                          >
                            <Users className="mr-2 size-4" />
                            {t('users')}
                          </DropdownMenuItem>
                          {/* )} */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* )} */}
                  </div>
                </Item>
              );
            })}
          </ItemGroup>
        ) : (
          <DefaultEmpty />
        )}
      </CardContent>
    </Card>
  );
}
