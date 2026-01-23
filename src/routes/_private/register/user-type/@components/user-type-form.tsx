import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UserTypeFormData } from '../@interface/user-type.schema';

export function UserTypeForm() {
  const { t } = useTranslation();
  const { control } = useFormContext<UserTypeFormData>();

  const sections = [
    {
      title: t('identification'),
      description: t('user_type.identification.description'),
      fields: [
        <FormField
          key="idEnterprise"
          control={control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={(val) => field.onChange(val || '')} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('description')} *</FieldLabel>
                <FormControl>
                  <Input placeholder={t('description')} {...field} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('appearance'),
      description: t('user_type.appearance.description'),
      fields: [
        <FormField
          key="color"
          control={control}
          name="color"
          render={({ field }) => (
            <FormItem className="sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel>{t('color')}</FieldLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" className="h-10 w-20 p-1" {...field} />
                    <Input type="text" placeholder="#000000" className="flex-1" {...field} />
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
