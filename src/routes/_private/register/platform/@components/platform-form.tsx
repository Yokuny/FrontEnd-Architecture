import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MODELS, OPERATORS, TYPE_PLATFORM } from '../@consts/platform.consts';
import type { PlatformFormData } from '../@interface/platform.schema';

export function PlatformForm({ isEdit }: { isEdit?: boolean }) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PlatformFormData>();

  return (
    <div className="space-y-12">
      {/* Section 1: Identification */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('identification')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('platforms.identification.description')}</p>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('name')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('name')} {...field} />
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
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('acronym')}</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('acronym')} {...field} />
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('code')} *</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('code')} disabled={isEdit} {...field} />
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
          <h2 className="font-semibold text-foreground">{t('technical_details')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('platforms.technical.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="basin"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('basin')}</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('basin')} {...field} />
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('type')}</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TYPE_PLATFORM).map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(type)}
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

          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('model')}</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('model')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MODELS).map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
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

          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="operator"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('operator')}</FieldLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('operator')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(OPERATORS).map((operator) => (
                          <SelectItem key={operator} value={operator}>
                            {operator}
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
        </div>
      </div>

      <Separator />

      {/* Section 3: Safety & Tracking */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('safety_tracking')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('platforms.safety.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="imo"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('imo')}</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('imo')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="mmsi"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('mmsi')}</FieldLabel>
                    <FormControl>
                      <Input placeholder={t('mmsi')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full sm:col-span-2">
            <FormField
              control={control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>
                      {t('radius')} ({t('meter.unity')})
                    </FieldLabel>
                    <FormControl>
                      <Input type="number" min={0} placeholder={t('radius')} {...field} />
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

      {/* Section 4: Location */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('location')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('platforms.location.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('latitude')}</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0000001" placeholder={t('latitude')} {...field} />
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
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('longitude')}</FieldLabel>
                    <FormControl>
                      <Input type="number" step="0.0000001" placeholder={t('longitude')} {...field} />
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

      {/* Section 5: AIS Dimensions */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-foreground">{t('ais_dimensions')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('platforms.ais.description')}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
            <FormField
              control={control}
              name="ais.distanceToBow"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('distance.to.bow')} (m)</FieldLabel>
                    <FormControl>
                      <Input type="number" placeholder="Bow" {...field} />
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
              name="ais.distanceToStern"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('distance.to.stern')} (m)</FieldLabel>
                    <FormControl>
                      <Input type="number" placeholder="Stern" {...field} />
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
              name="ais.distanceToStarboard"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('distance.to.starboard')} (m)</FieldLabel>
                    <FormControl>
                      <Input type="number" placeholder="Starboard" {...field} />
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
              name="ais.distanceToPortSide"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('distance.to.port')} (m)</FieldLabel>
                    <FormControl>
                      <Input type="number" placeholder="Port" {...field} />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
