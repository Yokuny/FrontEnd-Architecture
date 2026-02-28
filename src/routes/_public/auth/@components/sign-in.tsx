import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { LogInProps } from '@/lib/interfaces/generic';
import { signinSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

export const SignIn = ({ isLoading, setIsLoading }: LogInProps) => {
  const { login } = useAuthApi();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    setIsLoading(true);
    try {
      await login.mutateAsync(values);
      toast.success('Login bem-sucedido');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha no login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center text-gray-700 dark:text-gray-200">
        <h1 className="font-semibold text-2xl tracking-tight">Conecte ao serviço</h1>
        <span className="flex justify-center gap-2 text-muted-foreground">
          Não possui conta?
          <Link to="/auth/signup" className="text-primary hover:underline">
            Comece a usar
          </Link>
        </span>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Senha" type="password" autoCapitalize="none" autoComplete="password" autoCorrect="off" className="!h-10" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </Form>
      </div>
      <span className="flex gap-2 text-muted-foreground text-sm">
        Esqueceu sua senha?
        <Link to="/auth/recovery" className="font-medium text-primary hover:underline">
          Recuperar senha
        </Link>
      </span>
    </div>
  );
};
