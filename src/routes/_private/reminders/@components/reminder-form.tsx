import { useFormContext } from 'react-hook-form';
import DatePickerButton from '@/components/data-inputs/date-picker-button';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GET, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';

import type { ReminderFormData } from '../@interface/reminder.interface';

async function fetchPatientsCombobox() {
  const res = await request('patient/partial', GET());
  if (!res.success) throw new Error(res.message);
  return comboboxWithImgFormat(res.data);
}

export function ReminderForm() {
  const form = useFormContext<ReminderFormData>();

  const sections = [
    {
      title: 'Informações do Lembrete',
      description: 'Adicione um novo lembrete para um paciente',
      fields: [
        <FormField
          key="Patient"
          control={form.control}
          name="Patient"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Paciente *</FormLabel>
              <FormControl>
                <PatientCombobox controller={field} fetchPatients={fetchPatientsCombobox} />
              </FormControl>
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
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Ligar para confirmar consulta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="scheduledDate"
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data do lembrete *</FormLabel>
              <FormControl>
                <DatePickerButton date={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString())} />
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
