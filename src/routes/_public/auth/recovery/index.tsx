import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
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
      const result = await forgotPassword.mutateAsync(values);
      setIsDisabled(true);
      toast.success(result.message);
    } catch {
      setIsDisabled(false);
      // error handled globally via MutationCache.onError
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
      <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
        <div className="flex w-full flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <ItemTitle className="font-semibold text-2xl tracking-tight">{t('recovery.title')}</ItemTitle>
            <ItemDescription>{t('recovery.description')}</ItemDescription>
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
                        <Input
                          placeholder={t('email')}
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className="h-12!"
                          disabled={isLoading || isDisabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" size="lg" disabled={isLoading || isDisabled}>
                  {isLoading && <Loader className="size-4 animate-spin" />}
                  {isDisabled ? t('recovery.sent') : t('recovery.send')}
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link to="/auth" className="text-muted-foreground text-sm transition-colors hover:text-foreground hover:underline">
                ← {t('back')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
