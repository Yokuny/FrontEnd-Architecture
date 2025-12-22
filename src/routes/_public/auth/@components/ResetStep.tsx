import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/use-auth-api';
import { type ResetPasswordFormValues, resetPasswordSchema } from '../@interface/reset-password.types';
import { PasswordRequirement } from './PasswordRequirement';

interface ResetStepProps {
  requestId: string;
}

export function ResetStep({ requestId }: ResetStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');

  // Password strength indicators
  const passwordStrength = {
    minLength: password.length >= 8,
    hasLowerCase: /[a-z]/.test(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasSpecialChar: /[*,@,#,!,?,_,\-,=,+,$]/.test(password),
  };

  const handleSubmit = (data: ResetPasswordFormValues) => {
    resetPassword({
      request: requestId,
      password: data.password,
      reCaptcha: data.code, // The code is actually the reCAPTCHA in this flow
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue('code', token || '');
  };

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <Shield className="h-12 w-12 text-blue-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          <FormattedMessage id="new.password" defaultMessage="Set New Password" />
        </CardTitle>
        <CardDescription className="text-zinc-400">
          <FormattedMessage id="new.password.details" defaultMessage="Choose a new password for your account" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* New Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="new.password" defaultMessage="New Password" />
                  </FormLabel>
                  <FormControl>
                    <Field>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder={intl.formatMessage({ id: 'new.password.placeholder', defaultMessage: 'Enter new password' })}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                          autoFocus
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Strength Indicators */}
            {password && (
              <div className="space-y-2 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-zinc-400 font-medium">
                  <FormattedMessage id="password.requirements" defaultMessage="Password Requirements:" />
                </p>
                <div className="space-y-1">
                  <PasswordRequirement met={passwordStrength.minLength} text={intl.formatMessage({ id: 'form.min.length', defaultMessage: 'At least 8 characters' })} />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text={intl.formatMessage({ id: 'form.has.lower.case', defaultMessage: 'One lowercase letter' })} />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text={intl.formatMessage({ id: 'form.has.upper.case', defaultMessage: 'One uppercase letter' })} />
                  <PasswordRequirement
                    met={passwordStrength.hasSpecialChar}
                    text={intl.formatMessage({ id: 'form.has.special.char', defaultMessage: 'One special character (*@#!?_-=+$)' })}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="account.confirm.password" defaultMessage="Confirm Password" />
                  </FormLabel>
                  <FormControl>
                    <Field>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={intl.formatMessage({ id: 'account.confirm.password.placeholder', defaultMessage: 'Re-enter password' })}
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={handleRecaptchaChange} theme="dark" />
            </div>
            {form.formState.errors.code && <p className="text-sm text-red-400 text-center">{form.formState.errors.code.message}</p>}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <FormattedMessage id="resetting" defaultMessage="Resetting..." />
                </>
              ) : (
                <FormattedMessage id="save" defaultMessage="Reset Password" />
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: '/auth' })}>
            <ArrowLeft className="h-4 w-4" />
            <FormattedMessage id="back.login" defaultMessage="Back to Login" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
