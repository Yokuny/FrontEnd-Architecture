import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import DefaultEmptyData from '@/components/default-empty-data';
import DefaultLoading from '@/components/default-loading';
import Send from '@/components/icons/Send.Icon';
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

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="invite-form" disabled={inviteUser.isPending}>
            {inviteUser.isPending ? <Spinner className="size-4" /> : <Send className="size-4" />}
            <span className="sr-only md:not-sr-only">Enviar convite</span>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : !clinic ? (
          <DefaultEmptyData />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="invite-form">
              <InviteForm form={form} isPending={inviteUser.isPending} clinic={clinic} />
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
