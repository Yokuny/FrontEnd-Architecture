import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import Loader from '@/components/icons/Loader.Icon';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { t } from '@/lib/helpers/translate.helper';
import type { LogInProps } from '@/lib/interfaces/generic.interface';
import { signinSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

export function SignIn({ isLoading, setIsLoading }: LogInProps) {
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
    } catch {
      // error handled globally via MutationCache.onError
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <ItemTitle className="font-semibold text-3xl tracking-tight">{t('welcome.back')}</ItemTitle>
        <ItemDescription className="flex gap-2">
          {t('no.account')}
          <Link to="/auth/signup" className="font-medium text-foreground decoration-dashed">
            {t('start.using')}
          </Link>
        </ItemDescription>
      </div>

      {/* Form */}
      <div className="w-full space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t('email')} type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" className="h-12!" disabled={isLoading} {...field} />
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
                      placeholder={t('password')}
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      className="h-12!"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="lg" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 size-4 animate-spin" />}
              {t('login')}
            </Button>
          </form>
        </Form>
      </div>
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs uppercase tracking-wide">ou</span>
        <Separator className="flex-1" />
      </div>

      <ItemDescription className="flex justify-center gap-2">
        {t('forgot.password')}
        <Link to="/auth/recovery" className="font-medium text-foreground decoration-dashed">
          {t('recover.password')}
        </Link>
      </ItemDescription>
    </div>
  );
}
