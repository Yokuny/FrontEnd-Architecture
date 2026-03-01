import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

import { type PasswordUpdate, passwordUpdateSchema } from '@/lib/interfaces/schemas/user.schema';
import { useSettingsMutations } from '../@hooks/use-settings-api';

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
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl">Configuração de Acesso</CardTitle>
        <CardDescription>Configure a senha de acesso ao sistema.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha antiga</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite sua senha antiga" type="password" disabled={changePassword.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite uma nova senha" type="password" disabled={changePassword.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Repita a nova senha" type="password" disabled={changePassword.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={changePassword.isPending} className="min-w-[150px]">
              {changePassword.isPending && <Spinner className="mr-2 size-4" />}
              Atualizar senha
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
