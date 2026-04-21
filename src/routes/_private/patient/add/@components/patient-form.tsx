import { useFieldArray, useFormContext } from 'react-hook-form';
import DefaultFormLayout from '@/components/default-form-layout';
import Add from '@/components/icons/Add.Icon';
import Delete from '@/components/icons/Delete.Icon';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { maskDate } from '@/lib/helpers/formatDate.helper';
import { formatCpfCnpj, formatPhone } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { NewPatient } from '@/lib/interfaces/schemas/patient.schema';

export function PatientForm() {
  const form = useFormContext<NewPatient>();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'phone',
  });

  const sections = [
    {
      title: t('personal.information'),
      description: t('patient.main.data'),
      fields: [
        <div key="personal-row-1" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t('name.required')}</FormLabel>
                  <FormDescription>{t('full.name.description')}</FormDescription>
                </div>
                <FormControl>
                  <Input {...field} placeholder={t('placeholder.enter.name')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('sex.required')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">{t('male')}</SelectItem>
                    <SelectItem value="F">{t('female')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="personal-row-2" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder={t('placeholder.enter.email')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('birthdate')}</FormLabel>
                <FormControl>
                  <Input
                    className="w-full max-w-48"
                    {...field}
                    value={field.value || ''}
                    placeholder={t('date.placeholder.br')}
                    onChange={(e) => field.onChange(maskDate(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('documents'),
      description: t('patient.identification.documents'),
      fields: [
        <div key="docs-row-1" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cpf')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder={t('placeholder.cpf')} onChange={(e) => field.onChange(formatCpfCnpj(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('rg')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder={t('placeholder.enter.rg')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('address'),
      description: t('patient.address.options'),
      fields: [
        <div key="row-3" className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_3fr]">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cep')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder={t('placeholder.cep')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('full.address')}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder={t('placeholder.full.address')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('contacts'),
      description: t('patient.contact.phones'),
      fields: [
        <div key="phones" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{t('phone.list')}</h4>
            <Button type="button" variant="outline" onClick={() => append({ number: '', tag: fields.length === 0 ? 'WhatsApp' : '' })}>
              <Add className="mr-2 size-4" />
              {t('add.phone')}
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col items-end gap-4 rounded-lg bg-secondary p-4 md:flex-row">
              <FormField
                control={form.control}
                name={`phone.${index}.number`}
                render={({ field: inputField }) => (
                  <FormItem className="w-full">
                    <FormLabel>{`#${index + 1} ${t('phone')}`}</FormLabel>
                    <FormControl>
                      <Input
                        {...inputField}
                        value={inputField.value || ''}
                        placeholder={t('placeholder.phone')}
                        onChange={(e) => inputField.onChange(formatPhone(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`phone.${index}.tag`}
                render={({ field: inputField }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t('identification')}</FormLabel>
                    <FormControl>
                      <Input {...inputField} value={inputField.value || ''} placeholder={t('placeholder.phone.tag')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                <Delete className="size-4" />
              </Button>
            </div>
          ))}
          {fields.length === 0 && <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground text-sm">{t('no.phones.registered')}</div>}
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
