import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MaintenancePlanFormData } from '../@interface/maintenance-plan';
import { PartsCycleField } from './parts-cycle-field';
import { ServicesGroupedField } from './services-grouped-field';

export function MaintenancePlanForm() {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<MaintenancePlanFormData>();

  const typeMaintenance = watch('typeMaintenance');

  const typeMaintenanceOptions = [
    { value: 'date', label: t('date') },
    { value: 'wear', label: t('wear') },
    { value: 'dateOrWear', label: t('date.or.wear') },
  ];

  const unityOptions = [
    { value: 'day', label: t('day.unity') },
    { value: 'week', label: t('week.unity') },
    { value: 'month', label: t('month.unity') },
  ];

  const typesWear = [
    { value: 'HORIMETER', label: t('horimeter') },
    { value: 'TRIGGER', label: t('trigger') },
    { value: 'ODOMETER', label: t('odometer') },
  ];

  const sections = [
    {
      title: t('identification'),
      description: t('maintenance.plan.identification.description'),
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
                  <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('description')} *</FieldLabel>
                <FormControl>
                  <Input {...field} placeholder={t('maintenance.description.placeholder')} maxLength={150} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="row-duration-notice-type" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{`${t('duration')} (${t('days')}) *`}</FieldLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="daysNotice"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{`${t('days.notice')} *`}</FieldLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="typeMaintenance"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('type.maintenance')} *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('type.maintenance')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeMaintenanceOptions.map((opt) => (
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
        </div>,
      ],
    },
    ...(typeMaintenance === 'date' || typeMaintenance === 'dateOrWear'
      ? [
          {
            title: t('time.cycle'),
            description: t('maintenance.plan.cycle.description'),
            fields: [
              <div key="row-cycle" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="maintanceCycle.value"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>{t('time.cycle')} *</FieldLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="maintanceCycle.unity"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>{t('unity.cycle')} *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('unity.cycle')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unityOptions.map((opt) => (
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
              </div>,
            ],
          },
        ]
      : []),
    ...(typeMaintenance === 'wear' || typeMaintenance === 'dateOrWear'
      ? [
          {
            title: t('wear'),
            description: t('maintenance.plan.wear.description'),
            fields: [
              <div key="row-wear" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="maintanceWear.value"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>{t('value')} *</FieldLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} />
                        </FormControl>
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="maintanceWear.type"
                  render={({ field }) => (
                    <FormItem>
                      <Field className="gap-2">
                        <FieldLabel>{t('type.wear.sensor')} *</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('type.wear.sensor')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {typesWear.map((opt) => (
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
              </div>,
            ],
          },
        ]
      : []),
    {
      title: t('services'),
      description: t('maintenance.plan.services.description'),
      fields: [<ServicesGroupedField key="services" />],
    },
    {
      title: t('parts'),
      description: t('maintenance.plan.services.description'),
      fields: [<PartsCycleField key="parts" />],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
