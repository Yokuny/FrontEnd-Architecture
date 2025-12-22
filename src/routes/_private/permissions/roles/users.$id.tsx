import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Trash2, UserPlus, Users } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole, useRolesApi, useRoleUsers } from '@/hooks/use-roles-api';

export const Route = createFileRoute('/_private/permissions/roles/users/$id')({
  component: RoleUsersPage,
});

function RoleUsersPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { removeUserFromRole } = useRolesApi();

  // Get enterprise from localStorage (same as legacy)
  const idEnterprise = localStorage.getItem('id_enterprise_filter') || '';

  const { data: role, isLoading: isLoadingRole } = useRole(id);
  const { data: users, isLoading: isLoadingUsers, refetch } = useRoleUsers(id, idEnterprise);

  const handleRemoveUser = async (idUser: string) => {
    try {
      await removeUserFromRole.mutateAsync({ idUser, idRole: id, idEnterprise });
      toast.success(intl.formatMessage({ id: 'success.remove' }));
      refetch();
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.remove' }));
    }
  };

  const isLoading = isLoadingRole || isLoadingUsers;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/permissions/roles' })}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <FormattedMessage id="role.users" defaultMessage="Usuários do Perfil" />
              </CardTitle>
              {role && <p className="text-sm text-muted-foreground mt-1">{role.description}</p>}
            </div>
          </div>
          <Button onClick={() => toast.info(intl.formatMessage({ id: 'feature.coming.soon', defaultMessage: 'Em breve...' }))}>
            <UserPlus className="mr-2 h-4 w-4" />
            <FormattedMessage id="role.user.permission" defaultMessage="Adicionar Usuário" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
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
                    {user.isUserSystem && (
                      <Badge variant="secondary">
                        <FormattedMessage id="user.system" defaultMessage="Usuário Sistema" />
                      </Badge>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <FormattedMessage id="remove.role.confirmation.user" defaultMessage="Remover usuário do perfil?" />
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <FormattedMessage id="remove.role.message" defaultMessage="O usuário perderá as permissões deste perfil." />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            <FormattedMessage id="cancel" defaultMessage="Cancelar" />
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveUser(user.idUser)} className="bg-destructive text-destructive-foreground">
                            <FormattedMessage id="remove" defaultMessage="Remover" />
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
          <div className="text-center py-8 text-muted-foreground">
            <FormattedMessage id="no.users.found" defaultMessage="Nenhum usuário encontrado." />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
