import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { numClean } from '@/lib/helpers/formatter.helper';
import { clinicSchema, type NewClinic } from '@/lib/interfaces/schemas/clinic.schema';
import { useClinicApi } from '@/query/clinic';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { ClinicForm } from './@components/clinic-form';

export const Route = createFileRoute('/_private/settings/clinic/')({
  component: SettingsClinic,
  staticData: {
    title: 'Clínica',
    description: 'Obtenha ou edite as informações gerenciais e estruturais da clínica',
  },
});

export function SettingsClinic() {
  const { data: clinic, isLoading } = useClinicApi();
  const { saveClinic } = useSettingsMutations();

  const form = useForm<NewClinic>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: '',
      email: '',
      code: '',
      cnpj: '',
      rooms: [{ name: 'Sala 1' }],
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (clinic) {
      form.reset({
        name: clinic.name || '',
        email: clinic.email || '',
        code: clinic.code || '',
        cnpj: clinic.cnpj || '',
        rooms: clinic.rooms?.map((room) => ({ _id: room._id, name: room.name })) || [],
      });
    }
  }, [clinic, form]);

  const onSubmit = async (values: NewClinic) => {
    const data = {
      name: values.name,
      email: values.email,
      code: values.code,
      cnpj: values.cnpj ? numClean(values.cnpj) : '',
      rooms: values.rooms.map((room) => ({
        _id: room._id,
        name: room.name,
      })),
    };

    try {
      await saveClinic.mutateAsync({ data, isUpdate: !!clinic });
      toast.success('Clínica salva com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar clínica');
    }
  };

  if (isLoading) return <DefaultLoading />;

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="clinic-form" disabled={saveClinic.isPending} className="min-w-32">
            {saveClinic.isPending && <Spinner className="mr-2 size-4" />}
            Salvar
          </Button>
        </CardAction>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="clinic-form">
          <CardContent className="p-0">
            <ClinicForm form={form} isPending={saveClinic.isPending} />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
