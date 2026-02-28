import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthApi } from '@/hooks/use-auth-api';
import type { LogInProps } from '@/lib/interfaces/generic';
import { emailSchema } from '@/lib/interfaces/schemas/user.schema';

export const SignUp = ({ isLoading, setIsLoading }: LogInProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { validateEmail } = useAuthApi();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    try {
      const res = await validateEmail.mutateAsync({ email: values.email });
      setIsDisabled(true);
      toast.success(res.message || 'Email validado com sucesso');
    } catch (e: any) {
      setIsDisabled(false);
      toast.error(e.message || 'Houve um erro na validação do E-mail');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-200">
        <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
        <span className="text-muted-foreground leading-6">Insira seu e-mail abaixo para se cadastrar.</span>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="E-mail" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" className="!h-10" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading || isDisabled}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Continuar
            </Button>
          </form>
        </Form>
      </div>
      <span className="text-muted-foreground text-center text-sm">
        Ao clicar em continuar, você está concordando com nossos
        <Link to="/terms" className="hover:text-primary mx-2 underline underline-offset-4">
          Termos de serviço
        </Link>
        e
        <Link to="/privacy" className="hover:text-primary ml-2 underline underline-offset-4">
          Politica de privacidade
        </Link>
        .
      </span>
    </div>
  );
};
