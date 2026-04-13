import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import Loader from '@/components/icons/Loader.Icon';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { t } from '@/lib/helpers/translate.helper';
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
    } catch {
      // error handled globally via MutationCache.onError
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <ItemTitle className="font-semibold text-2xl tracking-tight">{t('reset.password')}</ItemTitle>
        <ItemDescription>{t('reset.password.description')}</ItemDescription>
      </div>

      {/* Form */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <Input value={userEmail} placeholder={t('email')} type="email" className="h-12!" disabled />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t('new.password')}
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="h-12!"
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
                      placeholder={t('confirm.password')}
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="h-12!"
                      disabled={resetPassword.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-12! w-full" size="lg" disabled={resetPassword.isPending}>
              {resetPassword.isPending && <Loader className="mr-2 size-4 animate-spin" />}
              {t('reset.password')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
