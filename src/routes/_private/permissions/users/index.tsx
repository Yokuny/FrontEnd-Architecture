import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Filter, Plus, Shield } from 'lucide-react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/hooks/use-users-api';
import { UserCard } from './@components/user-card';

export const Route = createFileRoute('/_private/permissions/users/')({
  component: ListUsersPage,
});

function ListUsersPage() {
  const navigate = useNavigate();
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
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <FormattedMessage id="users.permissions" />
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                <FormattedMessage id="filter" />
              </Button>
              {hasPermissionAdd && (
                <Button size="sm" onClick={() => navigate({ to: '/permissions/users/add' })}>
                  <Plus className="mr-2 h-4 w-4" />
                  <FormattedMessage id="add.user" />
                </Button>
              )}
              {hasPermissionPermissions && (
                <Button size="sm" variant="secondary" onClick={() => navigate({ to: '/permissions/users/permissions/add' })}>
                  <Shield className="mr-2 h-4 w-4" />
                  <FormattedMessage id="new.permission" />
                </Button>
              )}
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
    </div>
  );
}
