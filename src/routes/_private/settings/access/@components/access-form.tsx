import type { UseFormReturn } from 'react-hook-form';
import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/helpers/translate.helper';
import type { PasswordUpdate } from '@/lib/interfaces/schemas/user.schema';

export function AccessForm({ form, isPending }: AccessFormProps) {
  const sections: FormSection[] = [
    {
      title: t('password.change.title'),
      description: t('password.change.description'),
      fields: [
        <FormField
          key="oldPassword"
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password.old')}</FormLabel>
              <FormControl>
                <Input placeholder={t('password.old.placeholder')} type="password" className="h-14!" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="newPassword"
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('new.password')}</FormLabel>
              <FormControl>
                <Input placeholder={t('password.new.placeholder')} type="password" className="h-14!" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="confirmPassword"
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('password.confirm.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('password.repeat.placeholder')} type="password" className="h-14!" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}

interface AccessFormProps {
  form: UseFormReturn<PasswordUpdate>;
  isPending: boolean;
}
