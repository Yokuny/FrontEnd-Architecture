import { useFormContext } from 'react-hook-form';

import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FINANCIAL_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../@consts/financial.consts';
import type { FinancialUpdateData } from '../@interface/financial.interface';

export function FinancialEditForm() {
  const form = useFormContext<FinancialUpdateData>();

  const sections = [
    {
      title: 'Editar Informações Financeiras',
      description: 'Atualize os dados de pagamento',
      fields: [
        <div key="edit-fields" className="flex w-full flex-wrap gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-28">
                <FormLabel>Valor Total</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-28">
                <FormLabel>Valor Pago</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="w-fit md:w-full md:max-w-52">
                <FormLabel>Método de Pagamento</FormLabel>
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
                <FormMessage />
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
                <FormMessage />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
