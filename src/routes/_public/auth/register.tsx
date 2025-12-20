import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, User } from 'lucide-react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
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
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            <FormattedMessage id="new.account" defaultMessage="Create Account" />
          </CardTitle>
          <CardDescription className="text-zinc-400">
            <FormattedMessage id="new.account.subtitle" defaultMessage="Sign up to get started" />
          </CardDescription>
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
                    <FormLabel className="text-zinc-300 font-medium">
                      <FormattedMessage id="account.name" defaultMessage="Full Name" />
                    </FormLabel>
                    <FormControl>
                      <Field>
                        <div className="relative">
                          <Input
                            {...field}
                            type="text"
                            placeholder={intl.formatMessage({ id: 'account.name.placeholder', defaultMessage: 'Enter your full name' })}
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
                      <FormLabel className="text-zinc-300 font-medium">
                        <FormattedMessage id="login.password" defaultMessage="Password" />
                      </FormLabel>
                      <FormControl>
                        <Field>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={intl.formatMessage({ id: 'login.password.placeholder', defaultMessage: 'Enter password' })}
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
              </FieldGroup>

              {/* Enterprise (if from invitation) */}
              {search.enterprise && search.id && (
                <Field>
                  <FieldLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="enterprise" defaultMessage="Enterprise" />
                  </FieldLabel>
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="termsAccepted" className="text-sm text-zinc-300 font-normal cursor-pointer leading-relaxed">
                        <FormattedMessage id="accept.terms" defaultMessage="I accept the" />{' '}
                        <a href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline" rel="noopener">
                          <FormattedMessage id="terms" defaultMessage="Terms of Service" />
                        </a>{' '}
                        <FormattedMessage id="accept.policy" defaultMessage="and" />{' '}
                        <a href="/policy" target="_blank" className="text-blue-400 hover:text-blue-300 underline" rel="noopener">
                          <FormattedMessage id="policy" defaultMessage="Privacy Policy" />
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
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <FormattedMessage id="creating" defaultMessage="Creating..." />
                  </>
                ) : (
                  <FormattedMessage id="save" defaultMessage="Create Account" />
                )}
              </Button>
            </form>
          </Form>

          {/* Back to Login */}
          <div className="text-center">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate({ to: '/auth' })} className="text-sm text-zinc-400 hover:text-white transition-colors gap-2">
              <ArrowLeft className="h-4 w-4" />
              <FormattedMessage id="back.login" defaultMessage="Back to Login" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
