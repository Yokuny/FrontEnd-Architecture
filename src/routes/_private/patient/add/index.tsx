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
import { t } from '@/lib/helpers/translate.helper';
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
    title: t('add.patient'),
    description: t('add.patient.page.description'),
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

  const { form, onSubmit, isPending } = usePatientForm(formData, (id) => {
    navigate({ to: '/patient/details', search: { id } });
  });

  const handleDelete = async () => {
    if (!initialData?._id) return;
    try {
      const result = await deletePatient.mutateAsync(initialData._id);
      toast.success(result.message);
      navigate({ to: '/patient', search: { page: 1, size: 20 } });
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(e);
    } catch {
      // error handled globally via MutationCache.onError
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
                  <span className="sr-only md:not-sr-only">{t('exclude')}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirm.delete.title')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('confirm.delete.patient.description')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                    <Delete className="size-4" />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button type="submit" form="patient-form" disabled={isPending} className="ml-auto">
            {isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('save')}</span>
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
