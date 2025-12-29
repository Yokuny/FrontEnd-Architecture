import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { CustomerSelect, EnterpriseWithSetupSelect, LanguageFormSelect, RoleSelect, TypeCredentialsSelect, UserTypeSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Enterprise } from '@/hooks/use-enterprises-api';
import { useUserForm } from './@hooks/use-user-form';

export const Route = createFileRoute('/_private/permissions/users/add')({
  component: AddUserPage,
  beforeLoad: () => ({
    title: 'add.user',
  }),
});

function AddUserPage() {
  const { t } = useTranslation();
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
    <Card>
      <CardHeader title={t('add.user')} />
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enterprise */}
            <div className="space-y-2 md:col-span-2">
              <EnterpriseWithSetupSelect mode="single" value={idEnterprise} onChange={handleEnterpriseChange} />
              {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{t(form.formState.errors.idEnterprise.message)}</p>}
            </div>

            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">{t('account.name')} *</Label>
              <Input id="name" {...form.register('name')} placeholder={t('account.name.placeholder')} maxLength={150} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{t(form.formState.errors.name.message)}</p>}
            </div>

            {/* Is System User */}
            <div className="flex items-center space-x-2">
              <Checkbox id="isUser" checked={isUser} onCheckedChange={(checked) => form.setValue('isUser', !!checked)} />
              <Label htmlFor="isUser" className="cursor-pointer">
                {t('user.system')}
              </Label>
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">
                {t('login.email')} {isUser && '*'}
              </Label>
              <Input id="email" type="email" {...form.register('email')} placeholder={t('login.email.placeholder')} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{t(form.formState.errors.email.message)}</p>}
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
              <RoleSelect isAll mode="multi" value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals)} />
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
                <Checkbox id="isSentMessageWelcome" checked={form.watch('isSentMessageWelcome')} onCheckedChange={(checked) => form.setValue('isSentMessageWelcome', !!checked)} />
                <Label htmlFor="isSentMessageWelcome" className="cursor-pointer">
                  {t('sent.message.welcome')} (WhatsApp)
                </Label>
              </div>
            )}

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
                <CustomerSelect mode="multi" idEnterprise={idEnterprise} value={form.watch('customers')} onChange={(vals) => form.setValue('customers', vals)} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
