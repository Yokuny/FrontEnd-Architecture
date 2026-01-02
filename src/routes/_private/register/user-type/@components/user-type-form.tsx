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
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<UserTypeFormData>();

  const sections = [
    {
      title: t('identification'),
      description: t('user_type.identification.description'),
      fields: [
        <Field key="idEnterprise" className="gap-2">
          <FormControl>
            <EnterpriseSelect
              mode="single"
              value={watch('idEnterprise')}
              onChange={(val) => setValue('idEnterprise', val || '')}
              placeholder={t('machine.idEnterprise.placeholder')}
            />
          </FormControl>
          {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
        </Field>,
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
                  <div className="flex gap-2 items-center">
                    <Input type="color" className="p-1 h-10 w-20" {...field} />
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
