import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MinMaxVesselSelect } from '@/components/selects/min-max-vessel-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AlertFormData } from '../@interface/alert';

export function MinMaxConfig() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<AlertFormData>();
  const idEnterprise = watch('idEnterprise');

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('description')} *</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('message.description.placeholder')} maxLength={150} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="idsMinMax"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('min.max')} *</FormLabel>
            <FormControl>
              <MinMaxVesselSelect idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} placeholder={t('minmax.select.placeholder')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
