import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS, OPERATORS, TYPE_PLATFORM } from '../@consts/platform.consts';
import type { PlatformFormData } from '../@interface/platform.schema';

export function PlatformForm({ isEdit }: { isEdit?: boolean }) {
  const { t } = useTranslation();
  const { control } = useFormContext<PlatformFormData>();

  const sections = [
    {
      title: t('identification'),
      description: t('platforms.identification.description'),
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
        <div key="row-name-acronym" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
        <FormField
          key="code"
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem className="sm:col-span-3">
              <Field className="gap-2">
                <FieldLabel>{t('code')} *</FieldLabel>
                <FormControl>
                  <Input placeholder={t('code')} disabled={isEdit} {...field} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('technical_details'),
      description: t('platforms.technical.description'),
      fields: [
        <div key="row-basin-type" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
        <div key="row-model-operator" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
      ],
    },
    {
      title: t('safety_tracking'),
      description: t('platforms.safety.description'),
      fields: [
        <div key="row-imo-mmsi-radius" className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <FormField
            control={control}
            name="radius"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>
                    {t('radius')} ({t('meter')})
                  </FieldLabel>
                  <FormControl>
                    <Input type="number" min={0} placeholder={t('radius')} {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('location'),
      description: t('platforms.location.description'),
      fields: [
        <div key="row-lat-lon" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
      ],
    },
    {
      title: t('ais.dimensions'),
      description: t('platforms.ais.description'),
      fields: [
        <div key="row-ais-1" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
        <div key="row-ais-2" className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
