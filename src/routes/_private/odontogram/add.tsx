import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { GET, request } from '@/lib/api/client';
import { comboboxWithImgFormat } from '@/lib/helpers/formatter.helper';
import { type NewOdontogram, odontogramSchema } from '@/lib/interfaces/schemas/odontogram.schema';
import { useOdontogramMutations } from '@/query/odontogram';
import Teeth from './@components/teeth';

export const Route = createFileRoute('/_private/odontogram/add')({
  component: OdontogramAddPage,
});

function OdontogramAddPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [patientOdontogram, setPatientOdontogram] = useState<any>(null);
  const { create } = useOdontogramMutations();

  const form = useForm<NewOdontogram>({
    resolver: zodResolver(odontogramSchema) as any,
    defaultValues: {
      Patient: '',
      Professional: '',
      finished: false,
      teeth: [],
    },
    mode: 'onChange',
  });

  const fetchPatients = async () => {
    const res = await request('patient/partial', GET());
    return comboboxWithImgFormat(res.data);
  };

  const fetchProfessionals = async () => {
    const res = await request('user/professionals', GET());
    return comboboxWithImgFormat(res.data);
  };

  const fetchPatientOdontogram = async (patientID: string) => {
    try {
      const res = await request(`patient/${patientID}/odontogram`, GET());
      if (res.success) {
        setPatientOdontogram(res.data);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onSubmit = async (values: NewOdontogram) => {
    try {
      await create.mutateAsync(values);
      toast.success('Odontograma cadastrado com sucesso');
      form.reset();

      if (values.Patient) {
        // @ts-expect-error
        navigate({ to: '/patient/$id/odontogram', params: { id: values.Patient } });
      } else {
        // @ts-expect-error
        navigate({ to: '/odontogram' });
      }
    } catch (e: any) {
      toast.error(e.message || 'Erro ao cadastrar odontograma');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Odontograma</CardTitle>
        <CardDescription>Adicione um novo odontograma vinculado ao paciente e profissional.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...(form as any)}>
          <form
            id="odontogram-form"
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form.getValues());
            }}
          >
            <div className="flex flex-col gap-4 md:flex-row md:px-6">
              <FormField
                control={form.control as any}
                name="Patient"
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    <FormControl>
                      <PatientCombobox
                        controller={{
                          ...field,
                          onChange: (value: string) => {
                            field.onChange(value);
                            if (value) {
                              fetchPatientOdontogram(value);
                            } else {
                              setPatientOdontogram(null);
                            }
                          },
                        }}
                        fetchPatients={fetchPatients}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="Professional"
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    <FormControl>
                      <ProfessionalCombobox controller={field} fetchProfessionals={fetchProfessionals} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg md:bg-muted md:p-6">
              <ScrollArea>
                <FormField
                  control={form.control as any}
                  name="teeth"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl className="text-xs md:text-md">
                        <Teeth form={field} odontogram={patientOdontogram?.odontogram} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <div className="flex justify-end gap-4 pt-4 md:px-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  // @ts-expect-error
                  navigate({ to: '/odontogram' });
                }}
              >
                Cancelar
              </Button>
              <Button form="odontogram-form" type="submit" disabled={create.isPending} className="min-w-[120px]">
                {create.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Cadastrar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
