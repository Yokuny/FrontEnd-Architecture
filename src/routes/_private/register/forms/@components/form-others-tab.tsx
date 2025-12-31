import { X } from 'lucide-react';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { UserSelect } from '@/components/selects/user-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataSelect } from '@/components/ui/data-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormOptions } from '../@hooks/use-form-options';
import type { FormFormData } from '../@interface/form.schema';

interface FormOthersTabProps {
  form: UseFormReturn<FormFormData>;
  idEnterprise: string;
  markAsChanged: () => void;
}

export function FormOthersTab({ form, idEnterprise, markAsChanged }: FormOthersTabProps) {
  const { t } = useTranslation();
  const { formTypeOptions } = useFormOptions();
  const [emailInput, setEmailInput] = useState('');

  const whatsapp = form.watch('whatsapp');
  const email = form.watch('email');
  const emails = form.watch('emails') || [];

  const addEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      form.setValue('emails', [...emails, emailInput]);
      setEmailInput('');
      markAsChanged();
    }
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    form.setValue('emails', newEmails);
    markAsChanged();
  };

  // Mock query for form types
  const formTypesQuery = { data: formTypeOptions, isLoading: false, isError: false, status: 'success' as const };

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('other'),
          description: t('form.others.desc', 'Configurações adicionais e notificações'),
          fields: [
            <div className="space-y-6" key="others-grid">
              <FormField
                control={form.control}
                name="typeForm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('type.form')}</FormLabel>
                    <FormControl>
                      <DataSelect
                        value={field.value || ''}
                        onChange={(val) => {
                          field.onChange(val);
                          markAsChanged();
                        }}
                        query={formTypesQuery as any}
                        placeholder={t('type.form')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={whatsapp}
                    onCheckedChange={(checked) => {
                      form.setValue('whatsapp', !!checked);
                      markAsChanged();
                    }}
                  />
                  <FormLabel htmlFor="whatsapp" className="cursor-pointer">
                    WhatsApp?
                  </FormLabel>
                </div>

                {whatsapp && (
                  <FormField
                    control={form.control}
                    name="users"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('users')}</FormLabel>
                        <FormControl>
                          <UserSelect
                            multi
                            idEnterprise={idEnterprise}
                            values={field.value as string[]}
                            onChangeMulti={(val) => {
                              field.onChange(val);
                              markAsChanged();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={email}
                    onCheckedChange={(checked) => {
                      form.setValue('email', !!checked);
                      markAsChanged();
                    }}
                  />
                  <FormLabel htmlFor="email" className="cursor-pointer">
                    Email?
                  </FormLabel>
                </div>

                {email && (
                  <div className="space-y-4">
                    <FormLabel>{t('email')}</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('select.email')}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addEmail();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addEmail}>
                        {t('add')}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {emails.map((e, i) => (
                        <Badge key={`${e}-${i}`} variant="secondary" className="flex items-center gap-1">
                          {e}
                          <X className="size-3 cursor-pointer" onClick={() => removeEmail(i)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>,
          ],
        },
      ]}
    />
  );
}
