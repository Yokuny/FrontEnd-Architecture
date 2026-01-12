import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ApiExternalFormData } from '../@interface/api-external';

export function ApiExternalForm({ showEnterpriseSelect }: { showEnterpriseSelect: boolean }) {
  const { t } = useTranslation();
  const [showKey, setShowKey] = useState(false);
  const {
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isLoading },
  } = useFormContext<ApiExternalFormData>();

  const isPending = isSubmitting;

  const sections = [
    ...(showEnterpriseSelect
      ? [
          {
            title: t('identification'),
            description: t('setup.api.external.identification.description', { defaultValue: 'Selecione a empresa para configurar as APIs externas.' }),
            fields: [
              <Field key="idEnterprise" className="gap-2">
                <FormControl>
                  <EnterpriseSelect
                    mode="single"
                    value={watch('idEnterprise')}
                    onChange={(val) => setValue('idEnterprise', val || '')}
                    placeholder={t('enterprise.placeholder')}
                    disabled={isLoading || isPending}
                  />
                </FormControl>
                {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
              </Field>,
            ],
          },
        ]
      : []),
    {
      title: t('setup.api.external.credentials'),
      description: t('setup.api.external.credentials.description', { defaultValue: 'Configure as chaves de acesso para APIs externas.' }),
      fields: [
        <FormField
          key="windyKey"
          control={control}
          name="windyKey"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>API Key Windy *</FieldLabel>
                <FormControl>
                  <div className="relative">
                    <Input id="windyKey" type={showKey ? 'text' : 'password'} placeholder="API KEY" {...field} disabled={isLoading || isPending} className="pr-10" />
                    <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
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
