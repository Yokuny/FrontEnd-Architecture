import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, User } from 'lucide-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/use-auth-api';
import { useLocale } from '@/hooks/use-locale';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { type RegisterFormValues, registerSchema, registerSearchSchema } from '@/routes/_public/auth/@interface/register.types';

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute('/_public/auth/register')({
  component: RegisterPage,
  validateSearch: registerSearchSchema,
});

// ============================================================================
// Main Component
// ============================================================================

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: '/_public/auth/register' }) as { id?: string; enterprise?: string };
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { locale } = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      reCaptcha: '',
    },
  });

  const handleSubmit = (data: RegisterFormValues) => {
    register({
      name: data.name,
      email: data.email,
      password: data.password,
      reCaptcha: data.reCaptcha,
      termsAccepted: data.termsAccepted,
      language: locale,
      enterprise: search.id,
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue('reCaptcha', token || '');
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">{t('new.account')}</CardTitle>
          <CardDescription className="text-zinc-400">{t('new.account.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">{t('account.name')}</FormLabel>
                    <FormControl>
                      <Field>
                        <div className="relative">
                          <Input
                            {...field}
                            type="text"
                            placeholder={t('account.name.placeholder')}
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                            autoFocus
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <User className="h-5 w-5 text-zinc-500" />
                          </div>
                        </div>
                      </Field>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300 font-medium">{t('login.email')}</FormLabel>
                    <FormControl>
                      <Field>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder={t('login.email.placeholder')}
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
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

              {/* Password */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300 font-medium">{t('login.password')}</FormLabel>
                      <FormControl>
                        <Field>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={t('login.password.placeholder')}
                              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300 font-medium">{t('account.confirm.password')}</FormLabel>
                      <FormControl>
                        <Field>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t('account.confirm.password.placeholder')}
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
              </FieldGroup>

              {/* Enterprise (if from invitation) */}
              {search.enterprise && search.id && (
                <Field>
                  <FieldLabel className="text-zinc-300 font-medium">{t('enterprise')}</FieldLabel>
                  <Input type="text" value={search.enterprise} disabled className="h-12 bg-white/5 border-white/10 text-white opacity-60" />
                </Field>
              )}

              {/* Terms & Conditions */}
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox id="termsAccepted" checked={field.value} onCheckedChange={field.onChange} variant="blue" className="mt-1" />
                    </FormControl>
                    <div className="space-y-1">
                      <Label htmlFor="termsAccepted" className="block text-sm text-zinc-300 font-normal cursor-pointer leading-relaxed">
                        {t('accept.terms')}{' '}
                        <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline" rel="noopener">
                          {t('terms')}
                        </a>{' '}
                        {t('accept.policy')}{' '}
                        <a href="/policy" target="_blank" className="text-blue-400 hover:text-blue-300 underline" rel="noopener">
                          {t('policy')}
                        </a>
                        .
                      </Label>
                      <FormMessage className="text-red-400" />
                    </div>
                  </FormItem>
                )}
              />

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={handleRecaptchaChange} theme="dark" />
              </div>
              {form.formState.errors.reCaptcha && <p className="text-sm text-red-400 text-center">{form.formState.errors.reCaptcha.message}</p>}

              {/* Submit Button */}
              <Button type="submit" disabled={isPending} variant="green" className="w-full font-semibold text-base">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('creating')}
                  </>
                ) : (
                  t('save')
                )}
              </Button>
            </form>
          </Form>

          {/* Back to Login */}
          <div className="text-center">
            <Button type="button" variant="ghost" onClick={() => navigate({ to: '/auth' })}>
              <ArrowLeft className="h-4 w-4" />
              {t('back.login')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
