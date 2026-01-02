import { useState } from 'react';
import type { ResetStep } from '@/routes/_public/auth/@interface/reset-password.types';

interface UseResetPasswordFormOptions {
  initialRequestId?: string;
}

export function useResetPasswordForm(options: UseResetPasswordFormOptions = {}) {
  const [step, setStep] = useState<ResetStep>(options.initialRequestId ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [requestId] = useState(options.initialRequestId || '');

  const handleRequestSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep('success');
  };

  return {
    step,
    email,
    requestId,
    onRequestSuccess: handleRequestSuccess,
  };
}
