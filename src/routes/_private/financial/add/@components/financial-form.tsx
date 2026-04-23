import { useFormContext } from 'react-hook-form';

import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProcedureComponent from '@/components/data-inputs/procedure-component';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import { FINANCIAL_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../@consts/financial.consts';
import type { FinancialCreateData } from '../@interface/financial.interface';

export function FinancialForm() {
  const form = useFormContext<FinancialCreateData>();

  const sections = [
    {
      title: t('patient.and.professional'),
      description: t('patient.professional.select'),
      fields: [
        <div key="patient-professional" className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="Patient"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('patient')}</FormLabel>
                <FormControl>
                  <PatientCombobox controller={{ ...field }} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Professional"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('professional')}</FormLabel>
                <FormControl>
                  <ProfessionalCombobox controller={{ ...field }} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>,
      ],
    },
    {
      title: t('procedures'),
      description: t('procedures.add.done'),
      fields: [
        <div key="procedures" className="rounded-lg md:border md:p-6">
          <ProcedureComponent form={form} disabled={false} currencyFormat={(v) => String(currencyFormat(v) ?? '')} statusDictionary={statusDictionary} />
        </div>,
      ],
    },
    {
      title: t('payment'),
      description: t('payment.info.status'),
      fields: [
        <div key="payment" className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('amount.total')}</FormLabel>
                <FormControl>
                  <Input type="number" className="w-full" placeholder="R$ 0,00" value={field.value || 0} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('amount.paid')}</FormLabel>
                <FormControl>
                  <Input type="number" className="w-full" placeholder="R$ 0,00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('payment.method.way')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full md:w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
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
              <FormItem className="w-full">
                <FormLabel>{t('status')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full md:w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCIAL_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
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
              <FormItem className="w-full">
                <FormLabel>{t('installments')}</FormLabel>
                <FormControl>
                  <Input type="number" className="w-full" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
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
