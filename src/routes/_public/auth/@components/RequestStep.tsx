import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRequestPasswordReset } from '@/hooks/use-auth-api';
import { type RequestResetFormValues, requestResetSchema } from '../@interface/reset-password.types';

interface RequestStepProps {
  onSuccess: (email: string) => void;
}

export function RequestStep({ onSuccess }: RequestStepProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const form = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: '',
      reCaptcha: '',
    },
  });

  const handleSubmit = (data: RequestResetFormValues) => {
    requestReset(
      { email: data.email.trim(), reCaptcha: data.reCaptcha },
      {
        onSuccess: () => {
          onSuccess(data.email);
        },
      },
    );
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue('reCaptcha', token || '');
  };

  return (
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{t('request.password')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('request.password.instructions')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{t('login.email')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type="email" placeholder={t('login.email.placeholder')} autoFocus />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={handleRecaptchaChange} theme="light" />
          </div>
          {form.formState.errors.reCaptcha && <p className="text-sm text-destructive text-center">{form.formState.errors.reCaptcha.message}</p>}

          <Button type="submit" variant="blue" disabled={isPending} className="w-full mt-4 font-semibold text-base" size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('sending')}
              </>
            ) : (
              t('continue')
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: '/auth' })}>
          <ArrowLeft className="h-4 w-4" />
          {t('back.login')}
        </Button>
      </div>
    </FieldGroup>
  );
}
