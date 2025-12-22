import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRolesAll } from '@/hooks/use-roles-api';
import { RoleCard } from './@components/role-card';

export const Route = createFileRoute('/_private/permissions/roles/')({
  component: ListRolesPage,
});

function ListRolesPage() {
  const navigate = useNavigate();
  const { data: roles, isLoading } = useRolesAll();

  // TODO: Get from permissions/menu state
  const hasPermissionAdd = true;
  const hasPermissionViewUsers = true;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <FormattedMessage id="role" />
          </CardTitle>
          {hasPermissionAdd && (
            <Button onClick={() => navigate({ to: '/permissions/roles/add' })}>
              <Plus className="mr-2 h-4 w-4" />
              <FormattedMessage id="new.role" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : roles && roles.length > 0 ? (
          <div className="space-y-4">
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} hasPermissionEdit={hasPermissionAdd} hasPermissionViewUsers={hasPermissionViewUsers} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FormattedMessage id="no.roles.found" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
