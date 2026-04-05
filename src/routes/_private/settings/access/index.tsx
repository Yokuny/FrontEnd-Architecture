import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Check from '@/components/icons/Check.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { type PasswordUpdate, passwordUpdateSchema } from '@/lib/interfaces/schemas/user.schema';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { AccessForm } from './@components/access-form';

export const Route = createFileRoute('/_private/settings/access/')({
  component: SettingsAccess,
  staticData: {
    title: 'Acesso',
    description: 'Configure a senha de acesso ao sistema.',
  },
});

export function SettingsAccess() {
  const { changePassword } = useSettingsMutations();

  const form = useForm<PasswordUpdate>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: PasswordUpdate) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        throw new Error('Você digitou senhas diferentes');
      }

      const body = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      await changePassword.mutateAsync(body);
      toast.success('Senha atualizada com sucesso');
      form.reset();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar senha');
    }
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="access-form" disabled={changePassword.isPending}>
            {changePassword.isPending ? <Spinner className="size-4" /> : <Check className="size-4" />}
            <span className="sr-only md:not-sr-only">Atualizar senha</span>
          </Button>
        </CardAction>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="access-form">
          <CardContent>
            <AccessForm form={form} isPending={changePassword.isPending} />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
