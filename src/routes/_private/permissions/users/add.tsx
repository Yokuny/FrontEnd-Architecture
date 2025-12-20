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
import { type UserFormData, userSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/add')({
  component: AddUserPage,
});

function AddUserPage() {
  const navigate = useNavigate();
  const intl = useIntl();
  const { createUser } = useUsersApi();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema.omit({ id: true })),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      idEnterprise: '',
      language: 'en',
      isUser: true,
      isOnlyContact: false,
      isSentMessageWelcome: true,
      isUserCustomer: false,
      roles: [],
      types: [],
      customers: [],
      typeCredentials: ['password'],
    },
  });

  const isUser = form.watch('isUser');
  const isUserCustomer = form.watch('isUserCustomer');
  const phone = form.watch('phone');

  const onSubmit = async (data: UserFormData) => {
    try {
      await createUser.mutateAsync(data);
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
              <FormattedMessage id="add.user" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enterprise - TODO: Add enterprise selector */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="idEnterprise">
                  <FormattedMessage id="enterprise" /> *
                </Label>
                <Input id="idEnterprise" {...form.register('idEnterprise')} placeholder={intl.formatMessage({ id: 'enterprise' })} />
                {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
              </div>

              {/* Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  <FormattedMessage id="account.name" /> *
                </Label>
                <Input id="name" {...form.register('name')} placeholder={intl.formatMessage({ id: 'account.name' })} maxLength={150} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>

              {/* Is System User */}
              <div className="flex items-center space-x-2">
                <Checkbox id="isUser" checked={isUser} onCheckedChange={(checked) => form.setValue('isUser', !!checked)} />
                <Label htmlFor="isUser" className="cursor-pointer">
                  <FormattedMessage id="user.system" />
                </Label>
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  <FormattedMessage id="login.email" /> {isUser && '*'}
                </Label>
                <Input id="email" type="email" {...form.register('email')} placeholder={intl.formatMessage({ id: 'login.email' })} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <Input id="phone" {...form.register('phone')} placeholder="WhatsApp" />
              </div>

              {/* Language - TODO: Add language selector */}
              <div className="space-y-2">
                <Label htmlFor="language">
                  <FormattedMessage id="language" />
                </Label>
                <Input id="language" {...form.register('language')} placeholder={intl.formatMessage({ id: 'language' })} />
              </div>

              {/* Send Welcome Message */}
              {phone && (
                <div className="flex items-center space-x-2 md:col-span-2">
                  <Checkbox
                    id="isSentMessageWelcome"
                    checked={form.watch('isSentMessageWelcome')}
                    onCheckedChange={(checked) => form.setValue('isSentMessageWelcome', !!checked)}
                  />
                  <Label htmlFor="isSentMessageWelcome" className="cursor-pointer">
                    <FormattedMessage id="sent.message.welcome" /> (WhatsApp)
                  </Label>
                </div>
              )}

              {/* Is Customer User */}
              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
                <Label htmlFor="isUserCustomer" className="cursor-pointer">
                  <FormattedMessage id="user.customer" />
                </Label>
              </div>

              {/* Roles - TODO: Add role selector */}
              <div className="space-y-2 md:col-span-2">
                <Label>
                  <FormattedMessage id="role" />
                </Label>
                <p className="text-sm text-muted-foreground">Role selector will be added here</p>
              </div>

              {/* User Types - TODO: Add user type selector */}
              <div className="space-y-2 md:col-span-2">
                <Label>
                  <FormattedMessage id="type" />
                </Label>
                <p className="text-sm text-muted-foreground">User type selector will be added here</p>
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
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
