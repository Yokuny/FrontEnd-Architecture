import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MACHINE_TYPES } from '@/lib/constants/select-options';
import type { ModelMachineFormData } from '../@interface/model-machine';

const VESSSEL_CII_OPTIONS = [
  { value: 'BULK_CARRIER', label: 'Bulk Carrier' },
  { value: 'GAS_CARRIER', label: 'Gas Carrier' },
  { value: 'TANKER', label: 'Tanker' },
  { value: 'CONTAINER_SHIP', label: 'Container ship' },
  { value: 'GENERAL_CARGO_SHIP', label: 'General cargo ship' },
  { value: 'REFRIGERATED_CARGO_CARRIER', label: 'Refrigerated cargo Carrier' },
  { value: 'COMBINATION_CARRIER', label: 'Combination Carrier' },
  { value: 'LNG_CARRIER', label: 'LNG Carrier' },
  { value: 'RO_RO_CARGO_SHIP', label: 'Ro-ro cargo ship' },
  { value: 'RO_RO_CARGO_SHIP_VC', label: 'Ro-ro cargo ship (VC)' },
  { value: 'RO_RO_PASSENGER_SHIP', label: 'Ro-ro passenger ship' },
  { value: 'CRUISE_PASSENGER_SHIP', label: 'Cruise passenger ship' },
];

interface ModelMachineFormProps {
  attachmentFields?: React.ReactNode[];
}

export function ModelMachineForm({ attachmentFields }: ModelMachineFormProps) {
  const { t } = useTranslation();
  const form = useFormContext<ModelMachineFormData>();
  const typeMachine = form.watch('typeMachine');

  const sections = [
    {
      title: t('identification'),
      description: t('models.machine.identification.description'),
      fields: [
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect value={field.value} onChange={field.onChange} mode="single" />
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
                <FieldLabel>{t('description')} *</FieldLabel>
                <FormControl>
                  <Input {...field} placeholder={t('description.placeholder')} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('configuration'),
      description: t('models.machine.configuration.description'),
      fields: [
        <div key="config-row" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="typeMachine"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('type.machine')} *</FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select.type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MACHINE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('color')}</FieldLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" {...field} className="w-12 h-10 p-1" />
                      <Input {...field} className="flex-1" />
                    </div>
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        typeMachine === 'ship' && (
          <FormField
            key="cii"
            control={form.control}
            name="typeVesselCIIReference"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('type.vessel')} (CII reference)</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select.type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VESSSEL_CII_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        ),
        <FormField
          key="specification"
          control={form.control}
          name="specification"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('specification')}</FieldLabel>
                <FormControl>
                  <Textarea {...field} rows={4} placeholder={t('specification.placeholder')} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
      ].filter(Boolean) as React.ReactNode[],
    },
  ];

  if (attachmentFields && attachmentFields.length > 0) {
    sections.push({
      title: t('files'),
      description: t('models.machine.attachments.description'),
      fields: attachmentFields,
    });
  }

  return <DefaultFormLayout sections={sections} />;
}
