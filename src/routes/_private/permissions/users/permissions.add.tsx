import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

import { CustomerSelect, EnterpriseSelect, RoleSelect, UserSelect } from '@/components/selects';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/use-users-api';
import { usePermissionForm } from './@hooks/use-permission-form';
import { userPermissionSearchSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/permissions/add')({
  component: AddPermissionPage,
  validateSearch: (search) => userPermissionSearchSchema.parse(search),
});

function AddPermissionPage() {
  const intl = useIntl();
  const search = Route.useSearch();
  const { id, idRef } = search;

  const { form, onSubmit, handleDelete, isLoading, isPending } = usePermissionForm(id, idRef);
  const { data: userRefData, isLoading: isLoadingUserRef } = useUser(idRef || '');

  const idEnterprise = form.watch('idEnterprise');
  const isUserCustomer = form.watch('isUserCustomer');

  if (isLoading && id) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <FormattedMessage id="loading" defaultMessage="Loading..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id={id ? 'edit.user.permission' : 'add.user.permission'} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enterprise */}
            <div className="space-y-2">
              <EnterpriseSelect
                mode="single"
                label={`${intl.formatMessage({ id: 'enterprise' })} *`}
                value={form.watch('idEnterprise')}
                onChange={(val) => form.setValue('idEnterprise', val || '')}
                disabled={!!id}
              />
              {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
            </div>

            {/* User */}
            <div className="space-y-2">
              <Label>
                <FormattedMessage id="username" /> *
              </Label>
              {idRef ? (
                <Input value={isLoadingUserRef ? '...' : userRefData?.name || idRef} disabled className="bg-muted" />
              ) : (
                <UserSelect idEnterprise={idEnterprise} value={form.watch('idUser')} onChange={(val) => form.setValue('idUser', (val as string) || '')} disabled={!!id} />
              )}
              {form.formState.errors.idUser && <p className="text-sm text-destructive">{form.formState.errors.idUser.message}</p>}
            </div>

            {/* Roles */}
            <div className="space-y-2 md:col-span-2">
              <RoleSelect mode="multi" label={intl.formatMessage({ id: 'role' })} value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals as string[])} />
            </div>

            {/* Is Customer User */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
              <Label htmlFor="isUserCustomer" className="cursor-pointer">
                <FormattedMessage id="user.customer" />
              </Label>
            </div>

            {/* Customers */}
            {isUserCustomer && (
              <div className="space-y-2 md:col-span-2">
                <CustomerSelect
                  mode="multi"
                  idEnterprise={idEnterprise}
                  label={intl.formatMessage({ id: 'customer' })}
                  value={form.watch('customers')}
                  onChange={(vals) => form.setValue('customers', vals)}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div>
            {id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <FormattedMessage id="delete" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <FormattedMessage id="delete.confirmation" />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <FormattedMessage id="delete.message.default" />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <FormattedMessage id="cancel" />
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      <FormattedMessage id="confirm" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
