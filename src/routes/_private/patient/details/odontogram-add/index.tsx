import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { GET, POST, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { usePatientQuery } from '@/query/patient';
import Teeth from '@/routes/_private/odontogram/@components/teeth';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/details/odontogram-add/')({
  component: OdontogramAddPage,
  staticData: {
    title: 'Novo Odontograma',
    description: 'Adicione um novo odontograma para o paciente.',
  },
  validateSearch: searchSchema,
});

function OdontogramAddPage() {
  const search = Route.useSearch();
  const id = search.id;
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = usePatientQuery(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewOdontogram>({
    resolver: zodResolver(odontogramSchema) as any,
    defaultValues: {
      Patient: id || '',
      Professional: '',
      finished: false,
      teeth: [],
    },
    mode: 'onChange',
  });

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

  const goBack = () => navigate({ to: '/patient/details', search: { id: id!, tab: 'odontogram' } });

  const onSubmit = async (values: NewOdontogram) => {
    if (!id) return;
    const body = {
      Patient: id,
      teeth: values.teeth || [],
      Professional: values.Professional,
    };

    setIsSubmitting(true);
    try {
      const res = await request('odontogram/create', POST(body));
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      goBack();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erro ao cadastrar odontograma');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      title: 'Profissional Responsável',
      description: 'Indique o profissional que realizará os procedimentos deste odontograma.',
      fields: [
        <FormField
          key="professional"
          control={form.control as any}
          name="Professional"
          render={({ field }) => (
            <FormItem className="w-full max-w-xs">
              <FormLabel>Profissional</FormLabel>
              <FormControl>
                <ProfessionalCombobox controller={field} fetchProfessionals={fetchProfessionals} />
              </FormControl>
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: 'Mapa de Execução',
      description: 'Seleção dos dentes para a prestação dos serviços odontológicos planejados.',
      layout: 'vertical' as const,
      fields: [
        <div key="teeth-map" className="rounded-lg md:bg-muted md:p-6">
          <ScrollArea>
            <FormField
              control={form.control as any}
              name="teeth"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="text-xs md:text-md">
                    <Teeth form={field} odontogram={patient?.odontogram} />
                  </FormControl>
                </FormItem>
              )}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>,
      ],
    },
  ];

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button form="odontogram-add-form" type="submit" disabled={isSubmitting || isLoadingPatient || !patient} className="min-w-[120px]">
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            Cadastrar
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
              id="odontogram-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form.getValues());
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
