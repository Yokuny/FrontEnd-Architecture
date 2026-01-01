import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MachineSelect } from '@/components/selects/machine-select';
import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AlertFormData } from '../@interface/alert';

export function MinMaxConfig() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<AlertFormData>();
  const idEnterprise = watch('idEnterprise');

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
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
                <MachineSelect
                  mode="multi"
                  idEnterprise={idEnterprise}
                  value={field.value}
                  onChange={field.onChange}
                  label={t('machines')}
                  placeholder={t('minmax.select.placeholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
