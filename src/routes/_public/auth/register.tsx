import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, User } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { useRegisterForm } from '@/routes/_public/auth/@hooks/use-register-form';
import { registerSearchSchema } from '@/routes/_public/auth/@interface/register.types';

export const Route = createFileRoute('/_public/auth/register')({
  component: RegisterPage,
  validateSearch: registerSearchSchema,
});

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ from: '/_public/auth/register' }) as { id?: string; enterprise?: string };

  const { form, recaptchaRef, showPassword, showConfirmPassword, isPending, onSubmit, onRecaptchaChange, onTogglePassword, onToggleConfirmPassword } = useRegisterForm({
    enterpriseId: search.id,
  });

  return (
    <AuthLayout>
      <FieldGroup className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t('new.account')}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t('new.account.subtitle')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">{t('name')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-14" type="text" placeholder={t('name.placeholder')} autoFocus />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <User className="size-5 text-muted-foreground" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">{t('email')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="h-14" type="email" placeholder={t('login.email.placeholder')} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Mail className="size-5 text-muted-foreground" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">{t('login.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} className="pr-12 h-14" type={showPassword ? 'text' : 'password'} placeholder={t('login.password.placeholder')} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={onTogglePassword}
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

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">{t('account.confirm.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} className="pr-12 h-14" type={showConfirmPassword ? 'text' : 'password'} placeholder={t('account.confirm.password')} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={onToggleConfirmPassword}
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
            </div>

            {/* Enterprise (if from invitation) */}
            {search.enterprise && search.id && (
              <Field>
                <FormLabel className="font-medium">{t('enterprise')}</FormLabel>
                <Input type="text" value={search.enterprise} disabled className="opacity-60" />
              </Field>
            )}

            {/* Terms & Conditions */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox id="termsAccepted" checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                  </FormControl>
                  <div className="space-y-1">
                    <Label htmlFor="termsAccepted" className="block text-sm font-normal cursor-pointer leading-relaxed">
                      {t('accept.terms')}{' '}
                      <a href="/terms" target="_blank" className="text-primary hover:underline" rel="noopener">
                        {t('terms')}
                      </a>{' '}
                      {t('accept.policy')}{' '}
                      <a href="/policy" target="_blank" className="text-primary hover:underline" rel="noopener">
                        {t('policy')}
                      </a>
                      .
                    </Label>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={onRecaptchaChange} theme="light" />
            </div>
            {form.formState.errors.reCaptcha && <p className="text-sm text-destructive text-center">{form.formState.errors.reCaptcha.message}</p>}

            {/* Submit Button */}
            <Button type="submit" variant="green" disabled={isPending} className="w-full mt-4 font-semibold text-base" size="lg">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
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
            <ArrowLeft className="size-4" />
            {t('back.login')}
          </Button>
        </div>
      </FieldGroup>
    </AuthLayout>
  );
}
