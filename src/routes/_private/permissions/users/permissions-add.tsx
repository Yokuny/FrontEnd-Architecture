import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-users-api';
import { usePermissionForm } from './@hooks/use-permission-form';
import { userPermissionSearchSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/permissions-add')({
  component: AddPermissionPage,
  validateSearch: (search) => userPermissionSearchSchema.parse(search),
});

function AddPermissionPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const { id, idRef } = search;

  const { form, onSubmit, handleDelete, isLoading, isPending } = usePermissionForm(id, idRef);
  const { data: userRefData, isLoading: isLoadingUserRef } = useUser(idRef || '');

  const idEnterprise = form.watch('idEnterprise');
  const isUserCustomer = form.watch('isUserCustomer');

  if (isLoading && id) {
    return (
      <Card>
        <CardHeader title={t('edit.user')} />
        <CardContent className="p-12">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader title={t(id ? 'edit.user.permission' : 'add.user.permission')} />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enterprise */}
            <div className="space-y-2">
              <EnterpriseSelect
                mode="single"
                label={`${t('enterprise')} *`}
                value={form.watch('idEnterprise')}
                onChange={(val) => form.setValue('idEnterprise', val || '')}
                disabled={!!id}
              />
              {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{t(form.formState.errors.idEnterprise.message)}</p>}
            </div>

            {/* User */}
            <div className="space-y-2">
              <Label>{t('username')} *</Label>
              {idRef ? (
                <Input value={isLoadingUserRef ? '...' : userRefData?.name || idRef} disabled className="bg-muted" />
              ) : (
                <UserSelect idEnterprise={idEnterprise} value={form.watch('idUser')} onChange={(val) => form.setValue('idUser', (val as string) || '')} disabled={!!id} />
              )}
              {form.formState.errors.idUser && <p className="text-sm text-destructive">{t(form.formState.errors.idUser.message)}</p>}
            </div>

            {/* Roles */}
            <div className="space-y-2 md:col-span-2">
              <RoleSelect mode="multi" label={t('role')} value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals as string[])} />
            </div>

            {/* Is Customer User */}
            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
              <Label htmlFor="isUserCustomer" className="cursor-pointer">
                {t('user.customer')}
              </Label>
            </div>

            {/* Customers */}
            {isUserCustomer && (
              <div className="space-y-2 md:col-span-2">
                <CustomerSelect
                  mode="multi"
                  idEnterprise={idEnterprise}
                  label={t('customer')}
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
                    <Trash2 className="mr-2 size-4" />
                    {t('delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      {t('confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
