import { createFileRoute } from '@tanstack/react-router';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useEnterpriseFilter } from '@/hooks/use-enterprises-api';
import { useRole, useRolesApi, useRoleUsers } from '@/hooks/use-roles-api';

const roleUsersSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute('/_private/permissions/roles/users/')({
  component: RoleUsersPage,
  validateSearch: (search) => roleUsersSearchSchema.parse(search),
});

function RoleUsersPage() {
  const { id } = Route.useSearch();
  const { t } = useTranslation();
  const { removeUserFromRole } = useRolesApi();

  const { idEnterprise } = useEnterpriseFilter();

  const { data: role, isLoading: isLoadingRole } = useRole(id);
  const { data: users, isLoading: isLoadingUsers, refetch } = useRoleUsers(id, idEnterprise);

  const handleRemoveUser = async (idUser: string) => {
    try {
      await removeUserFromRole.mutateAsync({ idUser, idRole: id, idEnterprise });
      toast.success(t('success.remove'));
      refetch();
    } catch (_error) {
      toast.error(t('error.remove'));
    }
  };

  const isLoading = isLoadingRole || isLoadingUsers;

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Users className="size-5" />
            {t('role.users')}
          </div>
        }
      >
        <div className="flex flex-col items-end gap-1">
          <Button onClick={() => toast.info(t('feature.coming.soon'))}>
            <UserPlus className="mr-2 size-4" />
            {t('role.user.permission')}
          </Button>
          {role && <p className="text-sm text-muted-foreground">{role.description}</p>}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        ) : users && users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => {
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div key={user.idUser} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderLeft: '4px solid #115C93' }}>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.image?.url} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {user.isUserSystem && <Badge variant="secondary">{t('user.system')}</Badge>}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('remove.role.confirmation.user')}</AlertDialogTitle>
                          <AlertDialogDescription>{t('remove.role.message')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveUser(user.idUser)} className="bg-destructive text-destructive-foreground">
                            {t('remove')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">{t('no.users.found')}</div>
        )}
      </CardContent>
    </Card>
  );
}
