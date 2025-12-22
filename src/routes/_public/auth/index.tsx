import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useLogin, useLoginSSO, useVerifyEmail } from '@/hooks/use-auth-api';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { EmailStep } from '@/routes/_public/auth/@components/EmailStep';
import { LoginOptionsStep } from '@/routes/_public/auth/@components/LoginOptionsStep';
import { RecaptchaStep } from '@/routes/_public/auth/@components/RecaptchaStep';
import { REMEMBER_EMAIL_KEY } from '@/routes/_public/auth/@consts/login.consts';
import type { LoginOption, LoginStep, PasswordFormValues } from '@/routes/_public/auth/@interface/login.types';

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute('/_public/auth/')({
  component: LoginPage,
});

// ============================================================================
// Main Component
// ============================================================================

function LoginPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const { rememberEmail, setRememberEmail, isLoading } = useAuth();
  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: login } = useLogin();
  const { mutate: loginSSO } = useLoginSSO();

  // Load remembered email on mount
  useState(() => {
    const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  });

  // Save/remove remembered email
  useState(() => {
    if (rememberEmail && email) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else if (!rememberEmail) {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  });

  const handleEmailSubmit = () => {
    setStep('recaptcha');
  };

  const handleRecaptchaVerify = (token: string | null) => {
    if (!token) return;

    verifyEmail(
      { email, reCaptcha: token },
      {
        onSuccess: (data) => {
          if (data && data.length > 0) {
            setLoginOptions(data);
            setStep('options');
          } else {
            // No login options available
            setStep('email');
            recaptchaRef.current?.reset();
          }
        },
        onError: () => {
          setStep('email');
          recaptchaRef.current?.reset();
        },
      },
    );
  };

  const handlePasswordLogin = (data: PasswordFormValues) => {
    login({ email, password: data.password });
  };

  const handleSSOLogin = ({ token, idToken }: { token: string; idToken: string }) => {
    loginSSO({ email, token, idToken });
  };

  const handleBackToEmail = () => {
    setStep('email');
    recaptchaRef.current?.reset();
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return <EmailStep email={email} onEmailChange={setEmail} rememberEmail={rememberEmail} onRememberChange={setRememberEmail} onSubmit={handleEmailSubmit} />;
      case 'recaptcha':
        return (
          <RecaptchaStep
            email={email}
            recaptchaRef={recaptchaRef as React.RefObject<ReCAPTCHA>}
            onVerify={handleRecaptchaVerify}
            onBack={handleBackToEmail}
            isLoading={isVerifying}
          />
        );
      case 'options':
        return (
          <LoginOptionsStep
            email={email}
            loginOptions={loginOptions}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onPasswordLogin={handlePasswordLogin}
            onSSOLogin={handleSSOLogin}
            onBack={handleBackToEmail}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            <FormattedMessage id="login.title" defaultMessage="Welcome Back" />
          </CardTitle>
          <CardDescription className="text-zinc-400">
            <FormattedMessage id="login.subtitle" defaultMessage="Sign in to your account" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">{renderStep()}</CardContent>
      </Card>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}
    </AuthLayout>
  );
}
