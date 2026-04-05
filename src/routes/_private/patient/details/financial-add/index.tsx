import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import ProcedureComponent from '@/components/data-inputs/procedure-component';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import Cross from '@/components/icons/Cross.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { usePatientQuery } from '@/query/patient';
import { FINANCIAL_STATUS_OPTIONS, PAYMENT_METHOD_OPTIONS } from './@consts/financial-options';
import { useFinancialAddForm } from './@hooks/use-financial-add-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/financial-add/')({
  component: FinancialAddPage,
  staticData: {
    title: 'Novo Registro Financeiro',
    description: 'Crie um novo registro financeiro para o paciente.',
  },
  validateSearch: searchSchema,
});

function FinancialAddPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'financial' } });

  const { form, isSubmitting, fetchProfessionals, handleSubmit } = useFinancialAddForm(id, goBack);

  const sections = [
    {
      title: 'Profissional',
      description: 'Selecione o profissional responsável',
      fields: [
        <div key="professional">
          <FormField
            control={form.control}
            name="Professional"
            render={({ field }) => (
              <FormItem className="w-full max-w-xs">
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
          <ProcedureComponent form={form} disabled={isSubmitting} currencyFormat={(v) => String(currencyFormat(v) ?? '')} statusDictionary={statusDictionary} />
        </div>,
      ],
    },
    {
      title: 'Pagamento',
      description: 'Informações de pagamento e status',
      fields: [
        <div key="payment" className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Valor total</FormLabel>
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
                <FormLabel>Valor pago</FormLabel>
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
                <FormLabel>Forma de pagamento</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
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
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
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
                <FormLabel>Parcelas</FormLabel>
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

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting || isLoadingPatient || !patient}>
            <Cross className="size-4" />
            <span className="sr-only md:not-sr-only">Cancelar</span>
          </Button>
          <Button type="submit" form="financial-add-form" disabled={isSubmitting || isLoadingPatient || !patient} className="min-w-[120px]">
            {isSubmitting ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Cadastrar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoadingPatient ? (
          <DefaultLoading />
        ) : !patient ? (
          <DefaultEmptyData />
        ) : (
          <Form {...(form as any)}>
            <form
              id="financial-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <DefaultFormLayout sections={sections} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
