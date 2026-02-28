import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signupSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

type FinishSignupFormProps = {
  userEmail: string;
  passkeyId: string;
};

export function FinishSignupForm({ userEmail, passkeyId }: FinishSignupFormProps) {
  const navigate = useNavigate();
  const { completeSignup } = useAuthApi();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      await completeSignup.mutateAsync({ id: passkeyId, name: values.name, email: userEmail, password: values.password });
      toast.success('Cadastro concluído com sucesso!');
      navigate({ to: '/auth' });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao finalizar cadastro');
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Complete seu cadastro</h1>
        <span className="text-muted-foreground leading-6">Preencha com seu nome e senha para começar a usar o sistema.</span>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <Input value={userEmail} placeholder="E-mail" type="email" className="!h-10" disabled />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome de usuário" type="text" autoCapitalize="none" className="!h-10" disabled={completeSignup.isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Senha"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="!h-10"
                      disabled={completeSignup.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={completeSignup.isPending}>
              {completeSignup.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Finalizar cadastro
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
