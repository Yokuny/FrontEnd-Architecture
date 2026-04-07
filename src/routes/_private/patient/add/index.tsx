import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import DefaultLoading from '@/components/default-loading';
import Check from '@/components/icons/Check.Icon';
import Delete from '@/components/icons/Delete.Icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { usePatientQuery } from '@/query/patient';
import { PatientForm } from './@components/patient-form';
import { usePatientApi } from './@hooks/use-patient-api';
import { usePatientForm } from './@hooks/use-patient-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/patient/add/')({
  component: PatientAddPage,
  staticData: {
    title: 'Adicionar Paciente',
    description: 'Página de criação de novo cadastro de paciente.',
  },
  validateSearch: searchSchema,
});

function PatientAddPage() {
  const { id } = useSearch({ from: '/_private/patient/add/' });
  const { data: patient, isLoading } = usePatientQuery(id);

  if (id && isLoading) {
    return (
      <Card asPage>
        <CardHeader />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return <PatientAddFormContent initialData={patient} />;
}

function PatientAddFormContent({ initialData }: { initialData?: any }) {
  const navigate = useNavigate();
  const { deletePatient } = usePatientApi();

  const formData = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      id: initialData._id,
    };
  }, [initialData]);

  const { form, onSubmit, isPending } = usePatientForm(formData);

  const handleDelete = async () => {
    if (!initialData?._id) return;
    try {
      await deletePatient.mutateAsync(initialData._id);
      toast.success('Excluído com sucesso');
      navigate({ to: '/patient', search: { page: 1, size: 20 } });
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(e);
      toast.success(initialData ? 'Paciente atualizado!' : 'Paciente cadastrado!');
      navigate({ to: '/patient', search: { page: 1, size: 20 } });
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar paciente');
    }
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          {initialData && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={deletePatient.isPending || isPending}>
                  {deletePatient.isPending ? <Spinner className="size-4" /> : <Delete className="size-4" />}
                  <span className="sr-only md:not-sr-only">Excluir</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>Esta ação não pode ser desfeita e excluirá todos os registros vinculados ao paciente.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                    <Delete className="size-4" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" form="patient-form" disabled={isPending} className="ml-auto">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Salvar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={submitHandler} id="patient-form">
          <CardContent>
            <PatientForm />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
