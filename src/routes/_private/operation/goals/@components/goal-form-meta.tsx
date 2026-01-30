import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoalOptions } from '../@hooks/use-goal-options';
import type { GoalFormData } from '../@interface/goals.schema';

export function GoalFormMeta() {
  const { t } = useTranslation();
  const { control } = useFormContext<GoalFormData>();
  const { goalTypes, years } = useGoalOptions();

  return (
    <div className="flex flex-row gap-4">
      <FormField
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
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('type')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="min-w-20">
                <SelectTrigger>
                  <SelectValue placeholder={t('select.type')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {goalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('year')}</FormLabel>
            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('year')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
