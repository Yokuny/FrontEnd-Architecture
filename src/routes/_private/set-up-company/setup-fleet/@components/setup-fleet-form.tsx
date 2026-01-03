import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { SetupFleetFormData } from '../@interface/setup-fleet';

export function SetupFleetForm({ isEnterpriseDisabled }: { isEnterpriseDisabled: boolean }) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isLoading },
  } = useFormContext<SetupFleetFormData>();

  const isPending = isSubmitting;

  const sections = [
    {
      title: t('identification'),
      description: t('setup.fleet.identification.description'),
      fields: [
        <Field key="idEnterprise" className="gap-2">
          <FormControl>
            <EnterpriseSelect
              mode="single"
              value={watch('idEnterprise')}
              onChange={(val) => setValue('idEnterprise', val || '')}
              placeholder={t('enterprise.placeholder')}
              disabled={isLoading || isPending || isEnterpriseDisabled}
            />
          </FormControl>
          {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
        </Field>,
      ],
    },
    {
      title: t('setup.fleet.coordinates'),
      description: t('setup.fleet.coordinates.description'),
      fields: [
        <div key="coords" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('lat.label')}</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder={t('lat.label')}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/[^(\-)(\d+).(\d+)]/g, ''))}
                      disabled={isLoading || isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('lon.label')}</FieldLabel>
                  <FormControl>
                    <Input
                      placeholder={t('lon.label')}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/[^(\-)(\d+).(\d+)]/g, ''))}
                      disabled={isLoading || isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="zoom"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>Zoom</FieldLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder="Zoom" {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
