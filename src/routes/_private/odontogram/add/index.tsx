import { createFileRoute, useNavigate } from '@tanstack/react-router';
import PatientCombobox from '@/components/data-inputs/patient-combobox';
import ProfessionalCombobox from '@/components/data-inputs/professional-combobox';
import DefaultFormLayout from '@/components/default-form-layout';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import Teeth from '../@components/teeth';
import { useOdontogramAddForm } from './@hooks/use-odontogram-add-form';

export const Route = createFileRoute('/_private/odontogram/add/')({
  component: OdontogramAddPage,
  staticData: {
    title: 'Novo Odontograma',
    description: 'Adicione um novo odontograma vinculado ao paciente e profissional.',
  },
});

function OdontogramAddPage() {
  const navigate = useNavigate({ from: Route.fullPath });

  const handleSuccess = (patientId: string) => {
    if (patientId) {
      navigate({ to: '/patient/details', search: { id: patientId, tab: 'odontogram' } });
    } else {
      // @ts-expect-error
      navigate({ to: '/odontogram' });
    }
  };

  const { form, patientOdontogram, isPending, fetchPatientOdontogram, clearPatientOdontogram, onSubmit } = useOdontogramAddForm(handleSuccess);

  const sections = [
    {
      title: 'Paciente',
      description: 'Selecione o paciente para o qual o odontograma será criado.',
      fields: [
        <FormField
          key="patient"
          control={form.control as any}
          name="Patient"
          render={({ field }) => (
            <FormItem className="w-full max-w-xs">
              <FormLabel>Paciente</FormLabel>
              <FormControl>
                <PatientCombobox
                  controller={{
                    ...field,
                    onChange: (value: string) => {
                      field.onChange(value);
                      if (value) {
                        fetchPatientOdontogram(value);
                      } else {
                        clearPatientOdontogram();
                      }
                    },
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />,
      ],
    },
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
                <ProfessionalCombobox controller={field} />
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
                    <Teeth form={field} odontogram={patientOdontogram?.odontogram} />
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
          <Button form="odontogram-add-form" type="submit" disabled={isPending} className="min-w-30">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Cadastrar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
