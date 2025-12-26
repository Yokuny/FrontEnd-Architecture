import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useRolesAll } from '@/hooks/use-roles-api';
import { RoleCard } from './@components/role-card';

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
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : roles && roles.length > 0 ? (
          <div className="space-y-4">
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} hasPermissionEdit={hasPermissionAdd} hasPermissionViewUsers={hasPermissionViewUsers} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">{t('no.roles.found')}</div>
        )}
      </CardContent>
    </Card>
  );
}
