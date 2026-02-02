import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Lock, MoreVertical, Pencil, Plus, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useUsers } from '@/hooks/use-users-api';
import { cn } from '@/lib/utils';
import { UserFilterDialog } from './@components/user-filter-dialog';

const userSearchSchema = z.object({
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  idRole: z.array(z.string()).optional(),
  idTypeUser: z.array(z.string()).optional(),
});

export const Route = createFileRoute('/_private/permissions/users/')({
  component: ListUsersPage,
  validateSearch: (search) => userSearchSchema.parse(search),
  beforeLoad: () => ({
    title: 'users.permissions',
  }),
});

function ListUsersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { page, pageSize, idRole, idTypeUser } = search;

  // TODO: Get from permissions/menu state
  const hasPermissionAdd = true;
  const hasPermissionEdit = true;
  const hasPermissionPermissions = true;
  const hasPermissionPassword = true;

  const { data, isLoading } = useUsers({
    page: page - 1,
    size: pageSize,
    idRole,
    idTypeUser,
  });

  const handleFilter = (filters: { idRole?: string[]; idTypeUser?: string[] }) => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        ...filters,
        page: 1,
      }),
    });
  };

  const handleClear = () => {
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        idRole: undefined,
        idTypeUser: undefined,
        page: 1,
      }),
    });
  };

  return (
    <Card>
      <CardHeader title={t('users.permissions')}>
        <div className="flex items-center gap-2">
          <UserFilterDialog initialFilters={{ idRole, idTypeUser }} onFilter={handleFilter} onClear={handleClear} />
          {hasPermissionAdd && (
            <Button onClick={() => navigate({ to: '/permissions/users/add' })}>
              <Plus className="size-4" />
              {t('add.user')}
            </Button>
          )}
          {hasPermissionPermissions && (
            <Button onClick={() => navigate({ to: '/permissions/users/permissions-add' })}>
              <Shield className="size-4" />
              {t('new.permission')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : data && data.data.length > 0 ? (
          <ItemGroup>
            {data.data.map((user) => {
              const isDisabled = !!user.disabledAt;
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const getStatusConfig = () => {
                if (isDisabled) return { color: 'text-red-500', label: 'user.disabled' };
                if (user.isOnlyContact) return { color: 'text-blue-500', label: 'just.contact' };
                return { color: 'text-green-500', label: 'user.system' };
              };

              const statusConfig = getStatusConfig();

              return (
                <Item
                  key={user.id}
                  variant="outline"
                  className={cn('cursor-pointer', isDisabled && 'opacity-60')}
                  onClick={() => {
                    if (hasPermissionEdit) {
                      navigate({
                        to: '/permissions/users/edit',
                        search: { id: user.id },
                      });
                    }
                  }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <ItemMedia>
                      <Avatar className="size-11">
                        <AvatarImage src={user.image?.url} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-0">
                      <ItemTitle className="text-base">{user.name}</ItemTitle>
                      <ItemDescription className="truncate">{user.email}</ItemDescription>
                    </ItemContent>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap items-center justify-end gap-2 pr-2">
                      {user.types?.map((type) => (
                        <Badge key={type.description} variant="secondary" className="h-6 text-[10px] uppercase" style={{ borderLeft: `3px solid ${type.color}` }}>
                          {type.description}
                        </Badge>
                      ))}
                      <div className="flex items-center gap-1.5 pl-2">
                        <div className={cn('size-2 rounded-full', statusConfig.color.replace('text', 'bg'))} />
                        <ItemDescription className="text-xs capitalize">{t(statusConfig.label)}</ItemDescription>
                      </div>
                    </div>

                    {(hasPermissionEdit || hasPermissionPermissions || hasPermissionPassword) && (
                      <div className="ml-2 flex items-center justify-end border-l pl-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {hasPermissionPermissions && user.userEnterprise && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate({
                                    to: '/permissions/users/permissions-add',
                                    search: user.userEnterprise?.length === 1 ? { id: user.userEnterprise[0].id } : { idRef: user.id },
                                  });
                                }}
                              >
                                <Shield className="mr-2 size-4" />
                                {t('permissions')}
                              </DropdownMenuItem>
                            )}
                            {hasPermissionEdit && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate({ to: '/permissions/users/edit', search: { id: user.id } });
                                }}
                              >
                                <Pencil className="mr-2 size-4" />
                                {t('edit')}
                              </DropdownMenuItem>
                            )}
                            {hasPermissionPassword && !user.isOnlyContact && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate({ to: '/permissions/users/password', search: { id: user.id } });
                                }}
                              >
                                <Lock className="mr-2 size-4" />
                                {t('new.password')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </Item>
              );
            })}
          </ItemGroup>
        ) : (
          <EmptyData />
        )}
      </CardContent>
    </Card>
  );
}
