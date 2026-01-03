import { useRef, useState } from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '@/hooks/use-auth';
import { useLogin, useLoginSSO, useVerifyEmail } from '@/hooks/use-auth-api';
import type { LoginOption, LoginStep, PasswordFormValues } from '@/routes/_public/auth/@interface/login.types';

export function useLoginForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { rememberEmail, setRememberEmail, rememberedEmail, setRememberedEmail, isLoading } = useAuth();

  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState(rememberedEmail || '');
  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail();
  const { mutate: login } = useLogin();
  const { mutate: loginSSO } = useLoginSSO();

  // Save/remove remembered email
  const updateRememberEmail = (remember: boolean) => {
    setRememberEmail(remember);
    if (remember && email) {
      setRememberedEmail(email);
    } else {
      setRememberedEmail(null);
    }
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (rememberEmail) {
      setRememberedEmail(newEmail);
    }
  };

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

  const togglePassword = () => setShowPassword(!showPassword);

  return {
    // State
    step,
    email,
    loginOptions,
    showPassword,
    rememberEmail,
    isLoading,
    isVerifying,
    recaptchaRef,

    // Handlers
    setEmail: handleEmailChange,
    setRememberEmail: updateRememberEmail,
    onEmailSubmit: handleEmailSubmit,
    onRecaptchaVerify: handleRecaptchaVerify,
    onPasswordLogin: handlePasswordLogin,
    onSSOLogin: handleSSOLogin,
    onBackToEmail: handleBackToEmail,
    onTogglePassword: togglePassword,
  };
}
