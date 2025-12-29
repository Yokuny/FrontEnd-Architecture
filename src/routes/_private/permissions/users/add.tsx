import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { CustomerSelect, EnterpriseWithSetupSelect, LanguageFormSelect, RoleSelect, TypeCredentialsSelect, UserTypeSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
        <CardContent className="space-y-12 py-10">
          {/* Section 1: User Profile */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('user_profile')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('users.profile.description')}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel>{t('enterprise')} *</FieldLabel>
                  <EnterpriseWithSetupSelect mode="single" value={idEnterprise} onChange={handleEnterpriseChange} placeholder={t('select.placeholder')} />
                  {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{t(form.formState.errors.idEnterprise.message as string)}</p>}
                </Field>
              </div>

              <div className="col-span-full sm:col-span-4">
                <Field className="gap-2">
                  <FieldLabel htmlFor="name">{t('account.name')} *</FieldLabel>
                  <Input id="name" {...form.register('name')} placeholder={t('account.name.placeholder')} maxLength={150} />
                  {form.formState.errors.name && <p className="text-sm text-destructive">{t(form.formState.errors.name.message as string)}</p>}
                </Field>
              </div>

              <div className="col-span-full sm:col-span-2 pt-8">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isUser" checked={isUser} onCheckedChange={(checked) => form.setValue('isUser', !!checked)} />
                  <FieldLabel htmlFor="isUser" className="cursor-pointer font-normal">
                    {t('user.system')}
                  </FieldLabel>
                </div>
              </div>

              <div className="col-span-full sm:col-span-4">
                <Field className="gap-2">
                  <FieldLabel htmlFor="email">
                    {t('login.email')} {isUser && '*'}
                  </FieldLabel>
                  <Input id="email" type="email" {...form.register('email')} placeholder={t('login.email.placeholder')} />
                  {form.formState.errors.email && <p className="text-sm text-destructive">{t(form.formState.errors.email.message as string)}</p>}
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="phone">WhatsApp</FieldLabel>
                  <Input id="phone" {...form.register('phone')} placeholder="WhatsApp" />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <LanguageFormSelect value={form.watch('language')} onChange={(val) => form.setValue('language', val)} />
                </Field>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Permissions & Access */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('permissions_access')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('users.access.description')}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <RoleSelect isAll mode="multi" value={form.watch('roles')} onChange={(vals) => form.setValue('roles', vals)} placeholder={t('select.placeholder')} />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <UserTypeSelect
                    mode="multi"
                    idEnterprise={idEnterprise}
                    value={form.watch('types')}
                    onChange={(vals) => form.setValue('types', vals)}
                    placeholder={t('select.placeholder')}
                  />
                </Field>
              </div>

              <div className="col-span-full">
                <Field className="gap-2">
                  <TypeCredentialsSelect
                    mode="multi"
                    value={form.watch('typeCredentials')}
                    onChange={(vals) => form.setValue('typeCredentials', vals)}
                    placeholder={t('select.placeholder')}
                  />
                </Field>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 3: Preferences & Configuration */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('preferences_config')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('users.preferences.description')}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
              {phone && (
                <div className="col-span-full mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSentMessageWelcome"
                      checked={form.watch('isSentMessageWelcome')}
                      onCheckedChange={(checked) => form.setValue('isSentMessageWelcome', !!checked)}
                    />
                    <FieldLabel htmlFor="isSentMessageWelcome" className="cursor-pointer font-normal">
                      {t('sent.message.welcome')} (WhatsApp)
                    </FieldLabel>
                  </div>
                </div>
              )}

              <div className="col-span-full">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isUserCustomer" checked={isUserCustomer} onCheckedChange={(checked) => form.setValue('isUserCustomer', !!checked)} />
                  <FieldLabel htmlFor="isUserCustomer" className="cursor-pointer font-normal">
                    {t('user.customer')}
                  </FieldLabel>
                </div>
              </div>

              {isUserCustomer && (
                <div className="col-span-full mt-4">
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
          <Button type="submit" disabled={isPending} className="min-w-[120px]">
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
