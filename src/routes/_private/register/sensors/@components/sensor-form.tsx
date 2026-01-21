import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { SensorFormData } from '../@interface/sensor.schema';

const SENSOR_TYPES = [
  { value: 'int', label: 'Integer' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'string', label: 'String' },
];

export function SensorForm({ isEdit }: { isEdit?: boolean }) {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<SensorFormData>();

  const sensorType = watch('type');

  const sections = [
    {
      title: t('identification'),
      description: t('sensors.identification.description'),
      fields: [
        <FormField
          key="idEnterprise"
          control={control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <EnterpriseSelect mode="single" value={field.value} onChange={(val) => field.onChange(val || '')} />
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="row-sensor" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sensorId"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('sensor.id.label')} *</FieldLabel>
                  <FormControl>
                    <Input placeholder={t('sensor.id.label')} disabled={isEdit} {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="sensor"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('sensor.name')} *</FieldLabel>
                  <FormControl>
                    <Input placeholder={t('sensor.name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        </div>,
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('description')}</FieldLabel>
                <FormControl>
                  <Textarea placeholder={t('description')} {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('configuration'),
      description: t('sensors.configuration.description'),
      fields: [
        <div key="row-type-unit" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('variable.type')}</FieldLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('variable.type')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SENSOR_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          {['int', 'decimal'].includes(sensorType || '') && (
            <FormField
              control={control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('unit')}</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('unit')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          )}
        </div>,
        ['int', 'decimal'].includes(sensorType || '') && (
          <div key="row-min-max" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="valueMin"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('sensor.signal.value.min')}</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder={t('sensor.signal.value.min')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="valueMax"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('sensor.signal.value.max')}</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0001" placeholder={t('sensor.signal.value.max')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>
        ),
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
