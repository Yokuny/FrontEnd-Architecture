import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { EmailConfigFormData } from '../@interface/setup-email';

export function EmailConfigForm({ isEnterpriseDisabled }: { isEnterpriseDisabled: boolean }) {
  const { t } = useTranslation();
  const [showPass, setShowPass] = useState(false);
  const {
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isLoading },
  } = useFormContext<EmailConfigFormData>();

  const isPending = isSubmitting;
  const secureValue = watch('secure');

  const sections = [
    {
      title: t('identification'),
      description: t('setup.email.identification.description'),
      fields: [
        <Field key="idEnterprise" className="gap-2">
          <FormControl>
            <EnterpriseSelect
              mode="single"
              value={watch('idEnterprise')}
              onChange={(val) => setValue('idEnterprise', val || '')}
              placeholder={t('enterprise.placeholder')}
              disabled={isLoading || isPending || !!isEnterpriseDisabled}
            />
          </FormControl>
          {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
        </Field>,
      ],
    },
    {
      title: t('setup.email.connection'),
      description: t('setup.email.connection.description'),
      fields: [
        <FormField
          key="host"
          control={control}
          name="host"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>Host *</FieldLabel>
                <FormControl>
                  <Input placeholder="smtp.example.com" {...field} disabled={isLoading || isPending} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
        <div key="port-secure" className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>Port *</FieldLabel>
                  <FormControl>
                    <Input type="number" placeholder="587" {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="secure" checked={secureValue} onCheckedChange={(checked) => setValue('secure', !!checked)} disabled={isLoading || isPending} variant="blue" />
              <FieldLabel htmlFor="secure" className="text-sm">
                Secure (SSL/TLS)
              </FieldLabel>
            </div>
          </div>
        </div>,
      ],
    },
    {
      title: t('setup.email.authentication'),
      description: t('setup.email.authentication.description'),
      fields: [
        <FormField
          key="accountname"
          control={control}
          name="accountname"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>Account Name</FieldLabel>
                <FormControl>
                  <Input placeholder="My Company" {...field} disabled={isLoading || isPending} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
        <FormField
          key="email"
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>Email *</FieldLabel>
                <FormControl>
                  <Input type="email" placeholder="noreply@example.com" {...field} disabled={isLoading || isPending} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
        <FormField
          key="password"
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>Password *</FieldLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...field} disabled={isLoading || isPending} className="pr-10" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
