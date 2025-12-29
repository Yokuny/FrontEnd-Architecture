import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { UserTypeFormData } from '../@interface/user-type.schema';

export function UserTypeForm() {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<UserTypeFormData>();

  return (
    <div className="space-y-12">
      {/* Section 1: Identification */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('user_type.identification.description')}</p>
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

          <div className="col-span-full">
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

      {/* Section 2: Appearance */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('appearance')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('user_type.appearance.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
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
