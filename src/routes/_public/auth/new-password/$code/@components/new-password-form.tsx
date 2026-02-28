import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { passwordResetSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

type NewPasswordFormProps = {
  userEmail: string;
  passkeyId: string;
};

export function NewPasswordForm({ userEmail, passkeyId }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const { resetPassword } = useAuthApi();

  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: userEmail,
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof passwordResetSchema>) {
    try {
      await resetPassword.mutateAsync({ id: passkeyId, email: values.email, password: values.password, confirmPassword: values.confirmPassword });
      toast.success('Senha redefinida com sucesso!');
      navigate({ to: '/auth' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao redefinir senha');
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Redefinir senha</h1>
        <span className="text-muted-foreground leading-6">Crie uma nova senha para sua conta.</span>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <Input value={userEmail} placeholder="E-mail" type="email" className="!h-10" disabled />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nova senha"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="!h-10"
                      disabled={resetPassword.isPending}
                      {...field}
                    />
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
                  <FormControl>
                    <Input
                      placeholder="Confirmar nova senha"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="!h-10"
                      disabled={resetPassword.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              {resetPassword.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Redefinir senha
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
