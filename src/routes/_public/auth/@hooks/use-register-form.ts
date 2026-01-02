import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/hooks/use-auth-api';
import { useLocale } from '@/hooks/use-locale';
import { type RegisterFormValues, registerSchema } from '@/routes/_public/auth/@interface/register.types';

interface UseRegisterFormOptions {
  enterpriseId?: string;
}

export function useRegisterForm(options: UseRegisterFormOptions = {}) {
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
      enterprise: options.enterpriseId,
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    form.setValue('reCaptcha', token || '');
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return {
    form,
    recaptchaRef,
    showPassword,
    showConfirmPassword,
    isPending,
    onSubmit: form.handleSubmit(handleSubmit),
    onRecaptchaChange: handleRecaptchaChange,
    onTogglePassword: togglePassword,
    onToggleConfirmPassword: toggleConfirmPassword,
  };
}
