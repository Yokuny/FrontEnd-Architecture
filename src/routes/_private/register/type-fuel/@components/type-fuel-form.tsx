import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { TypeFuelFormData } from '../@interface/type-fuel.schema';

export function TypeFuelForm() {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TypeFuelFormData>();

  return (
    <div className="space-y-12">
      {/* Section 1: Identification */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('fuel.identification.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full">
            <Field className="gap-2">
              <FieldLabel>{t('enterprise')} *</FieldLabel>
              <FormControl>
                <EnterpriseSelect
                  mode="single"
                  value={watch('idEnterprise')}
                  onChange={(val) => setValue('idEnterprise', val || '')}
                  placeholder={t('machine.idEnterprise.placeholder')}
                />
              </FormControl>
              {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
            </Field>
          </div>

          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('code')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('code')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-3">
            <FormField
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
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Properties */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('properties')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('fuel.properties.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="density"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('density')} *</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder={t('density')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="co2Coefficient"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('co2.coefficient')}</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder={t('co2.coefficient')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="color"
              render={({ field }) => (
                <FormItem>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
