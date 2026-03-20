import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { type UserInvite, userInviteSchema } from '@/lib/interfaces/schemas/user.schema';
import { useClinicApi } from '@/query/clinic';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { InviteForm } from './@components/invite-form';

export const Route = createFileRoute('/_private/settings/invite/')({
  component: SettingsInvite,
  staticData: {
    title: 'Convites',
    description: 'Envie convites por e-mail para novos usuários colaborarem na clínica.',
  },
});

export function SettingsInvite() {
  const { data: clinic, isLoading } = useClinicApi();
  const { inviteUser } = useSettingsMutations();

  const form = useForm<UserInvite>({
    resolver: zodResolver(userInviteSchema),
    defaultValues: {
      email: '',
      rooms: [],
      role: 'professional',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: UserInvite) => {
    try {
      await inviteUser.mutateAsync({
        email: values.email,
        role: values.role,
        rooms: values.rooms,
      });
      toast.success('Convite enviado com sucesso');
      form.reset();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao enviar convite');
    }
  };

  if (isLoading) return <DefaultLoading />;
  if (!clinic) return null;

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="invite-form" disabled={inviteUser.isPending} className="min-w-36">
            {inviteUser.isPending && <Spinner className="mr-2 size-4" />}
            Enviar convite
          </Button>
        </CardAction>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="invite-form">
          <CardContent className="p-0">
            <InviteForm form={form} isPending={inviteUser.isPending} clinic={clinic} />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
