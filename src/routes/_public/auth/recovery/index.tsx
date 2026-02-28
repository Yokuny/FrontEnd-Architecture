import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { emailSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

export const Route = createFileRoute('/_public/auth/recovery/')({
  component: RecoveryPasswordPage,
});

function RecoveryPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { forgotPassword } = useAuthApi();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    try {
      await forgotPassword.mutateAsync(values);
      setIsDisabled(true);
      toast.success('E-mail de recuperação enviado com sucesso!');
    } catch (e) {
      setIsDisabled(false);
      toast.error(e instanceof Error ? e.message : 'Erro ao enviar e-mail de recuperação');
    } finally {
      setIsLoading(false);
    }
  }

  const previousPage = () => window.history.back();

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-10 flex h-full flex-col items-center justify-between">
        <div className="flex h-full w-full max-w-96 justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-200">
              <h1 className="font-semibold text-2xl tracking-tight">Recuperar senha</h1>
              <span className="text-muted-foreground leading-6">Insira seu e-mail e enviaremos um link para redefinir sua senha.</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="E-mail"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className="!h-10"
                          disabled={isLoading || isDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" disabled={isLoading || isDisabled}>
                  {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                  {isDisabled ? 'E-mail enviado' : 'Enviar link de recuperação'}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <Button disabled={isLoading} onClick={previousPage} variant="outline" className="group flex w-full max-w-96 gap-4">
            Voltar
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
