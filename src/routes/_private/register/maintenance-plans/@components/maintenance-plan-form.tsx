import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

  return (
    <div className="space-y-8 pb-10">
      {/* Identification Section */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('maintenance.plan.identification.description')}</p>
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full">
              <FormField
                control={control}
                name="idEnterprise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('enterprise')} *</FormLabel>
                    <FormControl>
                      <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>{t('description')} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('maintenance.description.placeholder')} maxLength={150} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <FormField
                control={control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t('duration')} (${t('days')}) *`}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <FormField
                control={control}
                name="daysNotice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t('days.notice')} *`}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <FormField
                control={control}
                name="typeMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('type.maintenance')} *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Configuration Section (Conditional) */}
      {(typeMaintenance === 'date' || typeMaintenance === 'dateOrWear') && (
        <>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('time.cycle')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('maintenance.plan.cycle.description')}</p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={control}
                  name="maintanceCycle.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('time.cycle')} *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-3">
                  <FormField
                    control={control}
                    name="maintanceCycle.unity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('unity.cycle')} *</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {(typeMaintenance === 'wear' || typeMaintenance === 'dateOrWear') && (
        <>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <h2 className="font-semibold text-foreground">{t('wear')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('maintenance.plan.wear.description')}</p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={control}
                  name="maintanceWear.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('value')} *</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-3">
                  <FormField
                    control={control}
                    name="maintanceWear.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('type.wear.sensor')} *</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Services Section */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('services')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('maintenance.plan.services.description')}</p>
        </div>
        <div className="md:col-span-2">
          <ServicesGroupedField />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium">{t('parts')}</h3>
          <p className="text-sm text-muted-foreground">{t('maintenance.plan.services.description')}</p>
        </div>
        <div className="md:col-span-3">
          <PartsCycleField />
        </div>
      </div>
    </div>
  );
}
