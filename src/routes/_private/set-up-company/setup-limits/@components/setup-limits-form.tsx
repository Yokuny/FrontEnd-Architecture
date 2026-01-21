import { ArrowLeftRight, MessageCircle, Users } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { SetupLimitsFormData } from '../@interface/setup-limits';

export function SetupLimitsForm({ isEnterpriseDisabled }: { isEnterpriseDisabled: boolean }) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitting, isLoading },
  } = useFormContext<SetupLimitsFormData>();

  const isPending = isSubmitting;

  const sections = [
    {
      title: t('identification'),
      description: t('setup.limits.identification.description'),
      fields: [
        <Field key="idEnterprise" className="gap-2">
          <FormControl>
            <EnterpriseSelect
              mode="single"
              value={watch('idEnterprise')}
              onChange={(val) => setValue('idEnterprise', val || '')}
              placeholder={t('select.company')}
              disabled={isLoading || isPending || isEnterpriseDisabled}
            />
          </FormControl>
        </Field>,
      ],
    },
    {
      title: t('setup.limits.general'),
      description: t('setup.limits.general.description'),
      fields: [
        <div key="general-limits" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="maxContacts"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    <FieldLabel>{t('max.contacts.chatbot')}</FieldLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="maxUsers"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <FieldLabel>{t('max.users')}</FieldLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('setup.limits.api'),
      description: t('setup.limits.api.description'),
      fields: [
        <div key="api-limits" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="maxRequestHistorySensorApi"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="size-4" />
                    <FieldLabel>{`${t('max.request.api.day')} (Histórico sensor)`}</FieldLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="maxRequestHistoryFleetApi"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="size-4" />
                    <FieldLabel>{`${t('max.request.api.day')} (Fleet positions)`}</FieldLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isLoading || isPending} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="maxRequestOffhireApi"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="size-4" />
                    <FieldLabel>{`${t('max.request.api.day')} (Offhire)`}</FieldLabel>
                  </div>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isLoading || isPending} />
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
