import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import type { CustomerFormData } from '../@interface/customer';

export function CustomerForm() {
  const { t } = useTranslation();
  const { control } = useFormContext<CustomerFormData>();
  const { idEnterprise } = useEnterpriseFilter();

  const sections = [
    {
      title: t('general.information'),
      description: t('customer.general.desc'),
      fields: [
        <FormField
          key="idEnterprise"
          control={control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect label={t('enterprise')} mode="single" value={field.value || idEnterprise} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="name"
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('name')} {...field} />
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
