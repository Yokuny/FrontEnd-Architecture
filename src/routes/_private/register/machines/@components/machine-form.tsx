import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { CountrySelect, EnterpriseSelect, FleetSelect, MaintenancePlanSelect, ModelMachineSelect, PartSelect, SensorByEnterpriseSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MachineFormData } from '../@interface/machine.interface';

const VESSEL_CII_OPTIONS = [
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

export function MachineForm({ isEdit }: { isEdit?: boolean }) {
  const { t } = useTranslation();
  const form = useFormContext<MachineFormData>();
  const idEnterprise = form.watch('idEnterprise');

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  const {
    fields: cameraFields,
    append: appendCamera,
    remove: removeCamera,
  } = useFieldArray({
    control: form.control,
    name: 'cameras',
  });

  const sections = [
    {
      title: t('general.information'),
      description: t('machine.general.description'),
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
        <div key="id-name-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('machine.id.placeholder')} *</FieldLabel>
                  <FormControl>
                    <Input {...field} disabled={isEdit} placeholder={t('machine.id.placeholder')} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2" key="name-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field className="gap-2">
                    <FieldLabel>{t('name')} *</FieldLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('machine.name.placeholder')} />
                    </FormControl>
                  </Field>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>,
        <FormField
          key="sensors"
          control={form.control}
          name="sensors"
          render={({ field }) => (
            <FormItem>
              <SensorByEnterpriseSelect
                label={t('sensors')}
                idEnterprise={idEnterprise}
                values={field.value?.map((s) => s.value)}
                onChangeMulti={(values) => {
                  field.onChange(values.map((v) => ({ value: v, label: v })));
                }}
                multi
              />
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="code-model-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('code')}</FieldLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('code')} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2" key="model-col">
            <FormField
              control={form.control}
              name="idModel"
              render={({ field }) => (
                <FormItem>
                  <ModelMachineSelect idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} mode="single" />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>,
        <FormField
          key="idFleet"
          control={form.control}
          name="idFleet"
          render={({ field }) => (
            <FormItem>
              <FleetSelect idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} mode="single" />
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('vessel.characteristics'),
      description: t('machine.vessel.description'),
      fields: [
        <div key="mmsi-imo-row" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mmsi"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>MMSI</FieldLabel>
                  <FormControl>
                    <Input {...field} placeholder="MMSI" />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imo"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>IMO</FieldLabel>
                  <FormControl>
                    <Input {...field} placeholder="IMO" />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="dims-row" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="dataSheet.lengthLoa"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('length.loa')}</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.width"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('width.vessel')}</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.deadWeight"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('deadweight')}</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.grossTonnage"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('gross.tonage')}</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="flag-year-call-row" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dataSheet.flag"
            render={({ field }) => (
              <FormItem>
                <CountrySelect value={field.value} onChange={field.onChange} mode="single" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.yearBuilt"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('year.build')}</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1900} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.callSign"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>Call Sign</FieldLabel>
                  <FormControl>
                    <Input {...field} placeholder="Call sign" />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <FormField
          key="cii"
          control={form.control}
          name="dataSheet.typeVesselCIIReference"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('type.vessel')} (CII reference)</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select.type')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VESSEL_CII_OPTIONS.map((opt) => (
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
        />,
      ],
    },
    {
      title: t('ais.dimensions'),
      description: t('machine.ais.description'),
      fields: [
        <div key="ais-dims" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="dataSheet.aisDimensions.distanceToBow"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('distance.to.bow')} (m)</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.aisDimensions.distanceToStern"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('distance.to.stern')} (m)</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.aisDimensions.distanceToStarboard"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('distance.to.starboard')} (m)</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataSheet.aisDimensions.distanceToPortSide"
            render={({ field }) => (
              <FormItem>
                <Field className="gap-2">
                  <FieldLabel>{t('distance.to.port')} (m)</FieldLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
      title: t('contacts'),
      description: t('machine.contacts.description'),
      fields: [
        <FormField
          key="managementName"
          control={form.control}
          name="dataSheet.managementName"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('management.person')}</FieldLabel>
                <FormControl>
                  <Input {...field} placeholder={t('management.person')} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="contacts-list" className="space-y-4">
          {contactFields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <Field className="gap-2">
                          <FieldLabel>{t('name')}</FieldLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('name')} />
                          </FormControl>
                        </Field>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end gap-2" key={`contact-phone-${field.id}`}>
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.phone`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Field className="gap-2">
                            <FieldLabel>{t('phone')}</FieldLabel>
                            <FormControl>
                              <Input {...field} placeholder={t('phone')} />
                            </FormControl>
                          </Field>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive h-10 w-10" onClick={() => removeContact(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendContact({ name: '', phone: '' })}>
            <Plus className="size-4 mr-2" />
            {t('add.contact')}
          </Button>
        </div>,
      ],
    },
    {
      title: t('cameras'),
      description: t('machine.cameras.description'),
      fields: [
        <div key="cameras-list" className="space-y-4">
          {cameraFields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`cameras.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <Field className="gap-2">
                          <FieldLabel>{t('name')}</FieldLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('name')} />
                          </FormControl>
                        </Field>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2 flex items-end gap-2" key={`camera-link-${field.id}`}>
                    <FormField
                      control={form.control}
                      name={`cameras.${index}.link`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Field className="gap-2">
                            <FieldLabel>{t('link')}</FieldLabel>
                            <FormControl>
                              <Input {...field} placeholder={t('link')} />
                            </FormControl>
                          </Field>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="text-destructive h-10 w-10" onClick={() => removeCamera(index)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button type="button" variant="default" size="sm" className="w-full" onClick={() => appendCamera({ name: '', link: '' })}>
            <Plus className="size-4 mr-2" />
            {t('add.camera')}
          </Button>
        </div>,
      ],
    },
    {
      title: t('maintenance.and.parts'),
      description: t('machine.maintenance.description'),
      fields: [
        <FormField
          key="parts"
          control={form.control}
          name="parts"
          render={({ field }) => (
            <FormItem>
              <PartSelect label={t('parts')} idEnterprise={idEnterprise} values={field.value} onChangeMulti={field.onChange} multi />
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="maintenancePlans"
          control={form.control}
          name="maintenancePlans"
          render={({ field }) => (
            <FormItem>
              <MaintenancePlanSelect idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} mode="multi" />
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
