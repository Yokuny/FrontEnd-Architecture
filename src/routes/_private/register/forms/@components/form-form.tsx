import { FileText, Settings, Shield } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FormFormData } from '../@interface/form.schema';
import { FormFieldsList } from './form-fields-list';
import { FormOthersTab } from './form-others-tab';
import { FormPermissionsTab } from './form-permissions-tab';

export function FormForm({ markAsChanged }: { markAsChanged: () => void }) {
  const { t } = useTranslation();
  const form = useFormContext<FormFormData>();
  const idEnterprise = form.watch('idEnterprise');

  const sections = [
    {
      title: t('identification'),
      description: t('form.identification.description', 'Identificação básica do formulário'),
      fields: [
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect
                mode="single"
                value={field.value}
                onChange={(val: string | undefined) => {
                  field.onChange(val || '');
                  markAsChanged();
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('description')}</FieldLabel>
                <Input
                  {...field}
                  placeholder={t('description')}
                  onChange={(e) => {
                    field.onChange(e);
                    markAsChanged();
                  }}
                />
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return (
    <>
      <DefaultFormLayout sections={sections} />

      <div className="px-6 pb-6 md:px-10 md:pb-10">
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="size-4" />
              {t('form')}
            </TabsTrigger>
            <TabsTrigger value="others" className="flex items-center gap-2">
              <Settings className="size-4" />
              {t('other')}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="size-4" />
              {t('permissions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-6">
            <FormFieldsList form={form as any} idEnterprise={idEnterprise} markAsChanged={markAsChanged} />
          </TabsContent>

          <TabsContent value="others" className="mt-6">
            <FormOthersTab form={form as any} idEnterprise={idEnterprise} markAsChanged={markAsChanged} />
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <FormPermissionsTab form={form as any} idEnterprise={idEnterprise} markAsChanged={markAsChanged} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
