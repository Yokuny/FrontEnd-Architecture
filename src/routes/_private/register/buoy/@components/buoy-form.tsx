import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { BuoyFormData } from '../@interface/buoy';

interface BuoyFormProps {
  isEdit?: boolean;
}

export function BuoyForm({ isEdit }: BuoyFormProps) {
  const { t } = useTranslation();
  const { control } = useFormContext<BuoyFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'delimitations',
  });

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('identification'),
          description: t('buoy.identification.description'),
          fields: [
            <FormField
              key="idEnterprise"
              control={control}
              name="idEnterprise"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('enterprise')} *</FieldLabel>
                    <FormControl>
                      <EnterpriseSelect value={field.value} onChange={field.onChange} disabled={isEdit} mode="single" />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
            <FormField
              key="name"
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('name')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
            <FormField
              key="proximity"
              control={control}
              name="proximity"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('proximity')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('proximity')} {...field} />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />,
          ],
        },
        {
          title: t('location'),
          description: t('buoy.location.description'),
          fields: [
            <div key="coordinates" className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <Field className="gap-2">
                      <FieldLabel>{t('latitude')} *</FieldLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <Field className="gap-2">
                      <FieldLabel>{t('longitude')} *</FieldLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                    </Field>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>,
          ],
        },
        {
          title: t('radius'),
          description: t('buoy.radius.description'),
          fields: [
            <div key="delimitations" className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  {index > 0 && <Separator className="my-4" />}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-1">
                      <FormField
                        control={control}
                        name={`delimitations.${index}.color`}
                        render={({ field }) => (
                          <FormItem>
                            <Field className="gap-2">
                              <FieldLabel>{t('color')}</FieldLabel>
                              <FormControl>
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-1 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                  <input type="color" className="w-full h-full border-0 bg-transparent cursor-pointer" {...field} />
                                </div>
                              </FormControl>
                            </Field>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:col-span-6">
                      <FormField
                        control={control}
                        name={`delimitations.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <Field className="gap-2">
                              <FieldLabel>{t('name')}</FieldLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </Field>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <FormField
                        control={control}
                        name={`delimitations.${index}.radius`}
                        render={({ field }) => (
                          <FormItem>
                            <Field className="gap-2">
                              <FieldLabel>{t('radius')}</FieldLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </Field>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => append({ name: '', radius: 0, color: '#3b82f6' })}>
                <Plus className="mr-2 size-4" />
                {t('buoy.delimitations.add')}
              </Button>
            </div>,
          ],
        },
      ]}
    />
  );
}
