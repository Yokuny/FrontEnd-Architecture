import { useFormContext } from 'react-hook-form';
import DatePickerButton from '@/components/data-inputs/date-picker-button';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/helpers/translate.helper';
import type { ReminderFormData } from '../@interface/reminder.interface';

export function ReminderForm() {
  const form = useFormContext<ReminderFormData>();

  const sections = [
    {
      title: t('reminder.info.title'),
      description: t('reminder.info.description'),
      fields: [
        <div key="patient-and-date" className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            key="Patient"
            control={form.control}
            name="Patient"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('patient.required')}</FormLabel>
                <FormControl>
                  <PatientCombobox controller={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            key="scheduledDate"
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('reminder.date.required')}</FormLabel>
                <FormControl>
                  <DatePickerButton date={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('description'),
      description: t('reminder.details'),
      fields: [
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description.required')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('reminder.description.example')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
