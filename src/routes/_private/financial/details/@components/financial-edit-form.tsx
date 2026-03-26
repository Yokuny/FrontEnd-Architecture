import { useFormContext } from 'react-hook-form';

import DefaultFormLayout from '@/components/default-form-layout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FINANCIAL_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../../@consts/financial.consts';
import type { FinancialUpdateData } from '../../@interface/financial.interface';

export function FinancialEditForm() {
  const form = useFormContext<FinancialUpdateData>();

  const sections = [
    {
      title: 'Editar Informações Financeiras',
      description: 'Atualize os dados de pagamento',
      fields: [
        <div key="edit-fields" className="flex w-full flex-col gap-4">
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Valor Total</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="R$ 0,00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Valor Pago</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="R$ 0,00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Método de Pagamento</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full!">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="installments"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Parcelas</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full!">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>,
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
