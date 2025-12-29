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
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
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
        <CardHeader title={t('edit.user.permission')} />
        <CardContent className="p-12">
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t(id ? 'edit.user.permission' : 'add.user.permission')} />
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-12 py-10">
          {/* Section 1: User Identification */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('identification')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('permissions.user.description')}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel>{t('enterprise')} *</FieldLabel>
                  <EnterpriseSelect
                    mode="single"
                    value={form.watch('idEnterprise')}
                    onChange={(val) => form.setValue('idEnterprise', val || '')}
                    disabled={!!id}
                    placeholder={t('select.placeholder')}
                  />
                  {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{t(form.formState.errors.idEnterprise.message as string)}</p>}
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel>{t('username')} *</FieldLabel>
                  {idRef ? (
                    <Input value={isLoadingUserRef ? '...' : userRefData?.name || idRef} disabled className="bg-muted" />
                  ) : (
                    <UserSelect
                      idEnterprise={idEnterprise}
                      value={form.watch('idUser')}
                      onChange={(val) => form.setValue('idUser', (val as string) || '')}
                      disabled={!!id}
                      placeholder={t('select.placeholder')}
                    />
                  )}
                  {form.formState.errors.idUser && <p className="text-sm text-destructive">{t(form.formState.errors.idUser.message as string)}</p>}
                </Field>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Access Control */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('access_control')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('permissions.access.description')}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel>{t('role')}</FieldLabel>
                  <RoleSelect isAll mode="multi" value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals as string[])} placeholder={t('select.placeholder')} />
                </Field>
              </div>

              <div className="col-span-full pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
                  <FieldLabel htmlFor="isUserCustomer" className="cursor-pointer font-normal">
                    {t('user.customer')}
                  </FieldLabel>
                </div>
              </div>

              {isUserCustomer && (
                <div className="col-span-full mt-2">
                  <Field className="gap-2">
                    <FieldLabel>{t('customer')}</FieldLabel>
                    <CustomerSelect
                      mode="multi"
                      idEnterprise={idEnterprise}
                      value={form.watch('customers')}
                      onChange={(vals) => form.setValue('customers', vals)}
                      placeholder={t('select.placeholder')}
                    />
                  </Field>
                </div>
              )}
            </div>
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
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
