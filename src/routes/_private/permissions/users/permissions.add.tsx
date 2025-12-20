import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsersApi } from '@/hooks/use-users-api';
import { type UserPermission, userPermissionSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/permissions/add')({
  component: AddPermissionPage,
});

function AddPermissionPage() {
  const navigate = useNavigate();
  const intl = useIntl();
  const { addPermission } = useUsersApi();

  const form = useForm<UserPermission>({
    resolver: zodResolver(userPermissionSchema.omit({ id: true })),
    defaultValues: {
      idUser: '',
      idEnterprise: '',
      roles: [],
      isUserCustomer: false,
      customers: [],
    },
  });

  const isUserCustomer = form.watch('isUserCustomer');

  const onSubmit = async (data: UserPermission) => {
    try {
      await addPermission.mutateAsync(data);
      toast.success(intl.formatMessage({ id: 'save.successfull' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="add.user.permission" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enterprise - TODO: Add enterprise selector */}
              <div className="space-y-2">
                <Label htmlFor="idEnterprise">
                  <FormattedMessage id="enterprise" /> *
                </Label>
                <Input id="idEnterprise" {...form.register('idEnterprise')} placeholder={intl.formatMessage({ id: 'enterprise' })} />
                {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
              </div>

              {/* User - TODO: Add user selector */}
              <div className="space-y-2">
                <Label htmlFor="idUser">
                  <FormattedMessage id="username" /> *
                </Label>
                <Input id="idUser" {...form.register('idUser')} placeholder={intl.formatMessage({ id: 'username' })} />
                {form.formState.errors.idUser && <p className="text-sm text-destructive">{form.formState.errors.idUser.message}</p>}
              </div>

              {/* Roles - TODO: Add role selector */}
              <div className="space-y-2 md:col-span-2">
                <Label>
                  <FormattedMessage id="role" />
                </Label>
                <p className="text-sm text-muted-foreground">Role selector will be added here</p>
              </div>

              {/* Is Customer User */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
                <Label htmlFor="isUserCustomer" className="cursor-pointer">
                  <FormattedMessage id="user.customer" />
                </Label>
              </div>

              {/* Customers - TODO: Add customer selector */}
              {isUserCustomer && (
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    <FormattedMessage id="customer" />
                  </Label>
                  <p className="text-sm text-muted-foreground">Customer selector will be added here</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={addPermission.isPending}>
              {addPermission.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
