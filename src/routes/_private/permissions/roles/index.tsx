import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DoorOpen, MoreVertical, Pencil, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DefaultEmpty from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useRolesAll } from '@/hooks/use-roles-api';

export const Route = createFileRoute('/_private/permissions/roles/')({
  component: ListRolesPage,
});

function ListRolesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: roles, isLoading } = useRolesAll();

  // TODO: Get from permissions/menu state
  const hasPermissionAdd = true;
  const hasPermissionViewUsers = true;

  return (
    <Card>
      <CardHeader title={t('role')}>
        {hasPermissionAdd && (
          <Button onClick={() => navigate({ to: '/permissions/roles/add' })}>
            <Plus className="mr-2 size-4" />
            {t('new.role')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : roles && roles.length > 0 ? (
          <ItemGroup>
            {roles.map((role) => (
              <Item
                key={role.id}
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  if (hasPermissionAdd) {
                    navigate({
                      to: '/permissions/roles/edit',
                      search: { id: role.id },
                    });
                  }
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

                {(hasPermissionAdd || hasPermissionViewUsers) && (
                  <div className="ml-2 flex items-center justify-end border-l pl-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="size-4" />
                          <span className="sr-only">{t('actions')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {hasPermissionAdd && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/permissions/roles/edit', search: { id: role.id } });
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            {t('edit')}
                          </DropdownMenuItem>
                        )}
                        {hasPermissionViewUsers && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate({ to: '/permissions/roles/users', search: { id: role.id } });
                            }}
                          >
                            <Users className="mr-2 size-4" />
                            {t('users')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <DefaultEmpty />
        )}
      </CardContent>
    </Card>
  );
}
