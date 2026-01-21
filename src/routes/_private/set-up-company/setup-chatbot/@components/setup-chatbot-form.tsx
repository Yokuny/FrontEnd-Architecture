import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SetupChatbotFormData } from '../@interface/setup-chatbot';

export function SetupChatbotForm({ isEnterpriseDisabled }: { isEnterpriseDisabled: boolean }) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isLoading },
  } = useFormContext<SetupChatbotFormData>();

  const isPending = isSubmitting;

  const sections = [
    {
      title: t('identification'),
      description: t('setup.chatbot.identification.description'),
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
          {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
        </Field>,
      ],
    },
    {
      title: t('configuration'),
      description: t('setup.chatbot.config.description'),
      fields: [
        <FormField
          key="phone"
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>WhatsApp</FieldLabel>
                <FormControl>
                  <Input placeholder="5511999999999" {...field} disabled={isLoading || isPending} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
        <FormField
          key="messageWelcome"
          control={control}
          name="messageWelcome"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('message.welcome')}</FieldLabel>
                <FormControl>
                  <Textarea placeholder={t('message.welcome')} rows={4} {...field} disabled={isLoading || isPending} />
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
