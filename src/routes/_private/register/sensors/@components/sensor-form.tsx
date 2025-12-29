import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SensorFormData>();

  const sensorType = watch('type');

  return (
    <div className="space-y-12">
      {/* Section 1: Identification */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('sensors.identification.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full">
            <Field className="gap-2">
              <FieldLabel>{t('enterprise')} *</FieldLabel>
              <FormControl>
                <EnterpriseSelect
                  mode="single"
                  value={watch('idEnterprise')}
                  onChange={(val) => setValue('idEnterprise', val || '')}
                  placeholder={t('machine.idEnterprise.placeholder')}
                />
              </FormControl>
              {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message as string)}</p>}
            </Field>
          </div>

          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="sensorId"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('sensor.id.placeholder')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('sensor.id.placeholder')} disabled={isEdit} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="sensor"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('sensor.name.placeholder')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('sensor.name.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full">
            <FormField
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
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Section 2: Technical Configuration */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('configuration')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('sensors.configuration.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
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
          </div>

          {['int', 'decimal'].includes(sensorType || '') && (
            <div className="col-span-full sm:col-span-3">
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
            </div>
          )}

          {['int', 'decimal'].includes(sensorType || '') && (
            <>
              <div className="col-span-full sm:col-span-3">
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
              </div>

              <div className="col-span-full sm:col-span-3">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
