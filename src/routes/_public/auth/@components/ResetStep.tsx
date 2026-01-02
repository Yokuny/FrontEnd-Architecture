import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/use-auth-api';
import { type ResetPasswordFormValues, resetPasswordSchema } from '../@interface/reset-password.types';
import { PasswordRequirement } from './PasswordRequirement';

interface ResetStepProps {
  requestId: string;
}

export function ResetStep({ requestId }: ResetStepProps) {
  const { t } = useTranslation();
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
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mx-auto mb-4 bg-primary/10 p-4 rounded-2xl w-fit border border-primary/20">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">{t('new.password')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('new.password.details')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {/* New Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{t('new.password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type={showPassword ? 'text' : 'password'} placeholder={t('new.password.placeholder')} className="pr-12" autoFocus />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Strength Indicators */}
          {password && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground font-medium">{t('password.requirements')}</p>
              <div className="space-y-1">
                <PasswordRequirement met={passwordStrength.minLength} text={t('form.min.length')} />
                <PasswordRequirement met={passwordStrength.hasLowerCase} text={t('form.has.lower.case')} />
                <PasswordRequirement met={passwordStrength.hasUpperCase} text={t('form.has.upper.case')} />
                <PasswordRequirement met={passwordStrength.hasSpecialChar} text={t('form.has.special.char')} />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">{t('account.confirm.password')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} type={showConfirmPassword ? 'text' : 'password'} placeholder={t('account.confirm.password.placeholder')} className="pr-12" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={handleRecaptchaChange} theme="light" />
          </div>
          {form.formState.errors.code && <p className="text-sm text-destructive text-center">{form.formState.errors.code.message}</p>}

          <Button type="submit" variant="green" disabled={isPending} className="w-full mt-4 font-semibold text-base" size="lg">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                {t('resetting')}
              </>
            ) : (
              t('save')
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: '/auth' })}>
          <ArrowLeft className="size-4" />
          {t('back.login')}
        </Button>
      </div>
    </FieldGroup>
  );
}
