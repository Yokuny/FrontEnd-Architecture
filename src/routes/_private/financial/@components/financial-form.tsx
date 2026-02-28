import { useFormContext } from 'react-hook-form';

import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProcedureComponent from '@/components/data-inputs/procedure-component';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { mapPatientsToCombobox, usePatientsQuery } from '@/query/patients';
import { mapProfessionalsToCombobox, useProfessionalsQuery } from '@/query/professionals';
import { FINANCIAL_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../@consts/financial.consts';
import type { FinancialCreateData } from '../@interface/financial.interface';

export function FinancialForm() {
  const form = useFormContext<FinancialCreateData>();
  const { data: patients } = usePatientsQuery();
  const { data: professionals } = useProfessionalsQuery();

  const fetchPatients = async () => mapPatientsToCombobox(patients);
  const fetchProfessionals = async () => mapProfessionalsToCombobox(professionals);

  const sections = [
    {
      title: 'Paciente e Profissional',
      description: 'Selecione o paciente e o profissional responsável',
      fields: [
        <div key="patient-professional" className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="Patient"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Paciente</FormLabel>
                <FormControl>
                  <PatientCombobox controller={{ ...field }} fetchPatients={fetchPatients} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Professional"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Profissional</FormLabel>
                <FormControl>
                  <ProfessionalCombobox controller={{ ...field }} fetchProfessionals={fetchProfessionals} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: 'Procedimentos',
      description: 'Adicione os procedimentos realizados',
      fields: [
        <div key="procedures" className="rounded-lg md:border md:p-6">
          <ProcedureComponent form={form} disabled={false} currencyFormat={(v) => String(currencyFormat(v) ?? '')} statusDictionary={statusDictionary} />
        </div>,
      ],
    },
    {
      title: 'Pagamento',
      description: 'Informações de pagamento e status',
      fields: [
        <div key="payment" className="flex w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-28">
                <FormLabel>Valor total</FormLabel>
                <FormControl>
                  <Input type="number" className="max-w-28 text-xs" placeholder="R$ 0,00" value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-28">
                <FormLabel>Valor pago</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="max-w-28 text-xs"
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-52">
                <FormLabel>Forma de pagamento</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full max-w-52 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} className="text-xs" value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-52">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full max-w-52 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCIAL_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} className="text-xs" value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-20">
                <FormLabel>Parcelas</FormLabel>
                <FormControl>
                  <Input type="number" className="max-w-20 text-xs" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
