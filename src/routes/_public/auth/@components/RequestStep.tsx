import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRequestPasswordReset } from '@/hooks/use-auth-api';
import { type RequestResetFormValues, requestResetSchema } from '../@interface/reset-password.types';

interface RequestStepProps {
  onSuccess: (email: string) => void;
}

export function RequestStep({ onSuccess }: RequestStepProps) {
  const intl = useIntl();
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
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="request.password" defaultMessage="Reset Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="request.password.instructions" defaultMessage="Enter your email to receive a reset code" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="login.email" defaultMessage="Email" />
                  </FormLabel>
                  <FormControl>
                    <Field>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder={intl.formatMessage({ id: 'login.email.placeholder', defaultMessage: 'Enter your email' })}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                          autoFocus
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Mail className="h-5 w-5 text-zinc-500" />
                        </div>
                      </div>
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={handleRecaptchaChange} theme="dark" />
            </div>
            {form.formState.errors.reCaptcha && <p className="text-sm text-red-400 text-center">{form.formState.errors.reCaptcha.message}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <FormattedMessage id="sending" defaultMessage="Sending..." />
                </>
              ) : (
                <FormattedMessage id="continue" defaultMessage="Continue" />
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: '/auth' })} className="text-sm text-zinc-400 hover:text-white transition-colors gap-2">
            <ArrowLeft className="h-4 w-4" />
            <FormattedMessage id="back.login" defaultMessage="Back to Login" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
