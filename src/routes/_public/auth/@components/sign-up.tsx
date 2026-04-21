import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import Loader from '@/components/icons/Loader.Icon';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { t } from '@/lib/helpers/translate.helper';
import type { LogInProps } from '@/lib/interfaces/generic.interface';
import { emailSchema } from '@/lib/interfaces/schemas/user.schema';
import { useAuthApi } from '@/query/auth';

export function SignUp({ isLoading, setIsLoading }: LogInProps) {
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
      toast.success(res.message || t('email.validated.success'));
    } catch {
      setIsDisabled(false);
      // error handled globally via MutationCache.onError
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <ItemTitle className="font-semibold text-3xl tracking-tight">{t('signup')}</ItemTitle>
        <ItemDescription className="flex gap-2">
          {t('has.account')}
          <Link to="/auth" className="font-medium text-foreground decoration-dashed">
            {t('signin')}
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
            <Button className="w-full" size="lg" disabled={isLoading || isDisabled}>
              {isLoading && <Loader className="size-4 animate-spin" />}
              {t('continue')}
            </Button>
          </form>
        </Form>

        <ItemDescription className="mx-auto w-11/12 text-center text-xs">
          {t('terms.agree')}{' '}
          <Link to="/auth" className="decoration-dashed hover:text-foreground">
            {t('terms')}
          </Link>{' '}
          {t('and')}{' '}
          <Link to="/auth" className="decoration-dashed hover:text-foreground">
            {t('privacy')}
          </Link>
          .
        </ItemDescription>
      </div>
    </div>
  );
}
