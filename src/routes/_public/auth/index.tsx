import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';

import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { EmailStep } from '@/routes/_public/auth/@components/EmailStep';
import { LoginOptionsStep } from '@/routes/_public/auth/@components/LoginOptionsStep';
import { RecaptchaStep } from '@/routes/_public/auth/@components/RecaptchaStep';
import { useLoginForm } from '@/routes/_public/auth/@hooks/use-login-form';

export const Route = createFileRoute('/_public/auth/')({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();

  const {
    step,
    email,
    loginOptions,
    showPassword,
    rememberEmail,
    isLoading,
    isVerifying,
    recaptchaRef,
    setEmail,
    setRememberEmail,
    onEmailSubmit,
    onRecaptchaVerify,
    onPasswordLogin,
    onSSOLogin,
    onBackToEmail,
    onTogglePassword,
  } = useLoginForm();

  const renderStep = () => {
    switch (step) {
      case 'email':
        return <EmailStep email={email} onEmailChange={setEmail} rememberEmail={rememberEmail} onRememberChange={setRememberEmail} onSubmit={onEmailSubmit} />;
      case 'recaptcha':
        return (
          <RecaptchaStep email={email} recaptchaRef={recaptchaRef as React.RefObject<ReCAPTCHA>} onVerify={onRecaptchaVerify} onBack={onBackToEmail} isLoading={isVerifying} />
        );
      case 'options':
        return (
          <LoginOptionsStep
            email={email}
            loginOptions={loginOptions}
            showPassword={showPassword}
            onTogglePassword={onTogglePassword}
            onPasswordLogin={onPasswordLogin}
            onSSOLogin={onSSOLogin}
            onBack={onBackToEmail}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <FieldGroup className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="font-bold text-2xl">{t('login.title')}</h1>
          <p className="text-balance text-muted-foreground text-sm">{t('login.subtitle')}</p>
        </div>

        {renderStep()}

        <Field>
          <FieldDescription className="px-6 text-center">
            {t('login.no.account')}{' '}
            <a href="/auth/register" className="text-primary underline underline-offset-4">
              {t('login.register')}
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
    </AuthLayout>
  );
}
