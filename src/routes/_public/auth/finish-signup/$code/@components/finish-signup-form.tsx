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
    } catch {
      // error handled globally via MutationCache.onError
    }
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <ItemTitle className="font-semibold text-2xl tracking-tight">{t('finish.signup')}</ItemTitle>
        <ItemDescription>{t('finish.signup.description')}</ItemDescription>
      </div>

      {/* Form */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3">
            <Input value={userEmail} placeholder={t('email')} type="email" className="h-12!" disabled />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t('username')} type="text" autoCapitalize="none" className="h-12!" disabled={completeSignup.isPending} {...field} />
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
                      autoComplete="new-password"
                      autoCorrect="off"
                      className="h-12!"
                      disabled={completeSignup.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-12! w-full" size="lg" disabled={completeSignup.isPending}>
              {completeSignup.isPending && <Loader className="mr-2 size-4 animate-spin" />}
              {t('finish.signup')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
