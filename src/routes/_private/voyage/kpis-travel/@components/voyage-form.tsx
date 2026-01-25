import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { CustomerSelect } from '@/components/selects/customer-select';
import { MachineEnterpriseSelect } from '@/components/selects/machine-enterprise-select';
import { Field, FieldLabel } from '@/components/ui/field';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import type { VoyageFormValues } from '../@interface/schema';
import { CompositionCard } from './composition-card';
import { CrewCard } from './crew-card';
import { GroupEventList } from './group-event-list';
import { ListItinerary } from './list-itinerary';

export function VoyageForm() {
  const { t } = useTranslation();
  const { control, watch, setValue } = useFormContext<VoyageFormValues>();
  const { idEnterprise } = useEnterpriseFilter();

  const sections = [
    {
      title: t('basic.info'),
      description: t('buoy.identification.description'),
      fields: [
        <FormField
          key="code"
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-1/3 min-w-40">
              <Field className="gap-2">
                <FieldLabel>{t('code.voyage')}</FieldLabel>
                <FormControl>
                  <Input placeholder={t('code.voyage')} {...field} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
        <div key="asset-customer" className="flex gap-2">
          <FormField
            control={control}
            name="asset"
            render={({ field }) => (
              <FormItem className="w-1/2 min-w-40">
                <Field className="gap-2">
                  <FormControl>
                    <MachineEnterpriseSelect mode="single" value={field.value?.value} onChange={(val) => field.onChange(val ? { value: val } : null)} idEnterprise={idEnterprise} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="customer"
            render={({ field }) => (
              <FormItem className="w-1/2 min-w-40">
                <Field className="gap-2">
                  <FormControl>
                    <CustomerSelect mode="single" value={field.value?.value} onChange={(val) => field.onChange(val ? { value: val } : null)} idEnterprise={idEnterprise} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
        <div key="activity-goal" className="flex gap-2">
          <FormField
            control={control}
            name="activity"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Field className="gap-2">
                  <FieldLabel>{t('activity')}</FieldLabel>
                  <FormControl>
                    <Input placeholder={t('activity')} {...field} />
                  </FormControl>
                </Field>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="goal"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <Field className="gap-2">
                  <FieldLabel>{t('goal')}</FieldLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder={t('goal')} {...field} onChange={(e) => field.onChange(e.target.value)} />
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
      title: t('itinerary'),
      description: t('data.maritme'),
      layout: 'vertical' as const,
      fields: [<ListItinerary key="itinerary" itinerary={watch('itinerary') || []} onChange={(val) => setValue('itinerary', val)} idEnterprise={idEnterprise} />],
    },
    {
      title: t('additional.info'),
      layout: 'vertical' as const,
      fields: [
        <div key="additional-row" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CompositionCard compositionAsset={watch('compositionAsset') || []} onChange={(val) => setValue('compositionAsset', val)} />
          <CrewCard crew={watch('crew') || []} onChange={(val) => setValue('crew', val)} />
        </div>,
      ],
    },
    {
      title: t('events'),
      layout: 'vertical' as const,
      fields: [<GroupEventList key="events" events={watch('events') || []} onChange={(val) => setValue('events', val)} />],
    },
    {
      title: t('observation'),
      layout: 'horizontal' as const,
      fields: [
        <FormField
          key="observation"
          control={control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <Field className="gap-2">
                <FieldLabel>{t('observation')}</FieldLabel>
                <FormControl>
                  <Textarea placeholder={t('observation')} {...field} />
                </FormControl>
              </Field>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
