import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { ChevronLeft, Filter, Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { AutoBreadcrumbs } from '@/components/auto-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/hooks/use-users-api';
import { UserCard } from './@components/user-card';

export const Route = createFileRoute('/_private/permissions/users/')({
  component: ListUsersPage,
  beforeLoad: () => ({
    title: 'users.permissions',
  }),
});

function ListUsersPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [page, _setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(10);

  // TODO: Get from permissions/menu state
  const hasPermissionAdd = true;
  const hasPermissionEdit = true;
  const hasPermissionPermissions = true;
  const hasPermissionPassword = true;

  const { data, isLoading } = useUsers({
    page: page - 1,
    size: pageSize,
  });

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-4">
          <AutoBreadcrumbs />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="shrink-0 rounded-full" onClick={() => router.history.back()}>
                <ChevronLeft className="size-5" />
              </Button>
              <CardTitle className="text-2xl font-bold">
                <FormattedMessage id="users.permissions" />
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="size-4" />
                <FormattedMessage id="filter" />
              </Button>
              {hasPermissionAdd && (
                <Button onClick={() => navigate({ to: '/permissions/users/add' })}>
                  <Plus className="size-4" />
                  <FormattedMessage id="add.user" />
                </Button>
              )}
              {hasPermissionPermissions && (
                <Button onClick={() => navigate({ to: '/permissions/users/permissions/add' })}>
                  <Shield className="size-4" />
                  <FormattedMessage id="new.permission" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
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
          <div className="text-center py-12 text-muted-foreground">
            <FormattedMessage id="no.users.found" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
