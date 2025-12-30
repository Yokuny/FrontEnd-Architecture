import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import EmptyStandard from '@/components/default-empty-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useUsers } from '@/hooks/use-users-api';
import { UserCard } from './@components/user-card';
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
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : data && data.data.length > 0 ? (
          <div className="space-y-4">
            {data.data.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                hasPermissionEdit={hasPermissionEdit}
                hasPermissionPermissions={hasPermissionPermissions}
                hasPermissionPassword={hasPermissionPassword}
              />
            ))}
          </div>
        ) : (
          <EmptyStandard />
        )}
      </CardContent>
    </Card>
  );
}
