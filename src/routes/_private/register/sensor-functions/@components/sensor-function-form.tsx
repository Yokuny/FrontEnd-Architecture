import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { MachineByEnterpriseSelect } from '@/components/selects/machine-by-enterprise-select';
import { SensorByEnterpriseSelect } from '@/components/selects/sensor-by-enterprise-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SensorFunctionFormData } from '../@interface/sensor-function.schema';

export function SensorFunctionForm({ idEnterprise }: { idEnterprise: string }) {
  const { t } = useTranslation();
  const { control } = useFormContext<SensorFunctionFormData>();

  const sections = [
    {
      title: t('general.information'),
      description: t('sensor.function.general.desc'),
      fields: [
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('description')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="algorithm"
          control={control}
          name="algorithm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('sensor.function.input.title')}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} className="mt-1 font-mono" placeholder={t('sensor.function.algorithm.placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('associations'),
      description: t('sensor.function.associations.desc'),
      fields: [
        <FormField
          key="idSensor"
          control={control}
          name="idSensor"
          render={({ field }) => (
            <FormItem>
              <SensorByEnterpriseSelect label={t('result.sensor')} idEnterprise={idEnterprise} value={field.value} onChange={(val) => field.onChange(val)} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="idMachines"
          control={control}
          name="idMachines"
          render={({ field }) => (
            <FormItem>
              <MachineByEnterpriseSelect mode="multi" label={t('machines')} idEnterprise={idEnterprise} value={field.value} onChange={(vals) => field.onChange(vals)} />
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
