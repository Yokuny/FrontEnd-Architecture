import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import { CustomerSelect, EnterpriseWithSetupSelect, LanguageFormSelect, RoleSelect, TypeCredentialsSelect, UserTypeSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Enterprise } from '@/hooks/use-enterprises-api';
import { useUserForm } from './@hooks/use-user-form';

export const Route = createFileRoute('/_private/permissions/users/add')({
  component: AddUserPage,
});

function AddUserPage() {
  const { form, onSubmit, isPending } = useUserForm();

  const idEnterprise = form.watch('idEnterprise');
  const isUser = form.watch('isUser');
  const isUserCustomer = form.watch('isUserCustomer');
  const phone = form.watch('phone');

  // Find the selected enterprise to check for SSO setup
  const handleEnterpriseChange = (value: string | undefined, data?: Enterprise) => {
    form.setValue('idEnterprise', value || '');
    // Reset fields that depend on enterprise if needed
    form.setValue('roles', []);
    form.setValue('types', []);
    form.setValue('customers', []);

    // If enterprise has SSO, we might want to default credentials,
    // but legacy code shows it only shows the select if ssoSetuped is true.
    if (data?.ssoSetuped) {
      form.setValue('typeCredentials', ['password', 'sso']);
    } else {
      form.setValue('typeCredentials', ['password']);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="add.user" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enterprise */}
              <div className="space-y-2 md:col-span-2">
                <EnterpriseWithSetupSelect mode="single" value={idEnterprise} onChange={handleEnterpriseChange} />
                {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
              </div>

              {/* Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  <FormattedMessage id="account.name" /> *
                </Label>
                <Input id="name" {...form.register('name')} placeholder="Nome" maxLength={150} />
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
                <Input id="email" type="email" {...form.register('email')} placeholder="Email" />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <Input id="phone" {...form.register('phone')} placeholder="WhatsApp" />
              </div>

              {/* Language */}
              <div className="space-y-2">
                <LanguageFormSelect value={form.watch('language')} onChange={(val) => form.setValue('language', val)} />
              </div>

              {/* Roles */}
              <div className="space-y-2 md:col-span-2">
                <RoleSelect mode="multi" value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals)} />
              </div>

              {/* User Types */}
              <div className="space-y-2 md:col-span-2">
                <UserTypeSelect mode="multi" idEnterprise={idEnterprise} value={form.watch('types')} onChange={(vals) => form.setValue('types', vals)} />
              </div>

              {/* Credentials By */}
              <div className="space-y-2 md:col-span-2">
                <TypeCredentialsSelect mode="multi" value={form.watch('typeCredentials')} onChange={(vals) => form.setValue('typeCredentials', vals)} />
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

              {/* Customers */}
              {isUserCustomer && (
                <div className="space-y-2 md:col-span-2">
                  <CustomerSelect mode="multi" idEnterprise={idEnterprise} value={form.watch('customers')} onChange={(vals) => form.setValue('customers', vals)} />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
