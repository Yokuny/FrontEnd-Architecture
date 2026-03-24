import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ProcedureComponent from '@/components/data-inputs/procedure-component';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { GET, POST, request } from '@/lib/api/client';
import { comboboxWithImgFormat, currencyFormat, statusDictionary } from '@/lib/helpers/formatter.helper';
import { usePatientQuery } from '@/query/patient';

const FINANCIAL_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'partial', label: 'Parcial' },
  { value: 'paid', label: 'Pago' },
  { value: 'canceled', label: 'Cancelado' },
  { value: 'refund', label: 'Reembolsado' },
] as const;

const PAYMENT_METHOD_OPTIONS = [
  { value: 'none', label: 'Nenhum' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'card', label: 'Cartão' },
  { value: 'pix', label: 'Pix' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'boleto', label: 'Boleto' },
] as const;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<any>({
    defaultValues: {
      Patient: id || '',
      Professional: '',
      procedures: [{ procedure: '', price: 0, status: 'pending' as const }],
      price: 0,
      paid: 0,
      status: 'pending' as const,
      paymentMethod: 'none',
      installments: 1,
    },
    mode: 'onChange',
  });

  const procedures = form.watch('procedures') || [];
  const proceduresWithPrice = procedures.filter((proc: any) => proc.price && proc.price > 0);
  const allPending = proceduresWithPrice.every((proc: any) => proc.status === 'pending');
  const allPaid = proceduresWithPrice.every((proc: any) => proc.status === 'paid');
  const currentStatus = proceduresWithPrice.length === 0 ? 'pending' : allPaid ? 'paid' : allPending ? 'pending' : 'partial';
  const totalPrice = procedures.reduce((acc: number, curr: any) => acc + (Number(curr.price) || 0), 0);

  useEffect(() => {
    form.setValue('status', currentStatus);
    form.setValue('price', totalPrice);
  }, [currentStatus, totalPrice, form]);

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'financial' } });

  const handleSubmit = async () => {
    if (!id) return;
    const values = form.getValues();

    if (!values.Professional) {
      toast.error('Selecione o profissional');
      return;
    }

    const body = {
      Patient: id,
      Professional: values.Professional,
      procedures: values.procedures,
      price: values.price,
      paid: values.paid,
      status: values.status,
      paymentMethod: values.paymentMethod,
      installments: values.installments,
    };

    setIsSubmitting(true);
    try {
      const res = await request('financial/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      goBack();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao criar registro financeiro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPatient) return <DefaultLoading />;
  if (!patient) return <div className="p-12 text-center">Paciente não encontrado.</div>;

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
          <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="financial-add-form" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            Cadastrar
          </Button>
        </CardAction>
      </CardHeader>
      <Form {...(form as any)}>
        <form
          id="financial-add-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <CardContent>
            <DefaultFormLayout sections={sections} />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
