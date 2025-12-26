import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useSendUnlockCode, useVerifyUnlockCode } from '@/hooks/use-auth-api';
import type { UnlockCodeFormValues, UnlockMethodFormValues, UnlockOption, UnlockStep } from '@/routes/_public/auth/@interface/unlock.types';

interface UseUnlockFormOptions {
  requestId: string;
}

export function useUnlockForm(options: UseUnlockFormOptions) {
  const navigate = useNavigate();
  const { requestId } = options;

  const [step, setStep] = useState<UnlockStep>('select-method');
  const [unlockOptions] = useState<UnlockOption[]>([
    { type: 'email', destination: 'u***@example.com' },
    { type: 'sms', destination: '+55 ** **** 1234' },
  ]);
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'sms'>('email');

  const { mutate: sendUnlockCode } = useSendUnlockCode();
  const { mutate: verifyUnlockCode } = useVerifyUnlockCode();

  const handleMethodSelect = (data: UnlockMethodFormValues) => {
    setSelectedMethod(data.method);

    sendUnlockCode(
      { requestId, method: data.method },
      {
        onSuccess: () => {
          setStep('verify-code');
        },
      },
    );
  };

  const handleCodeVerify = (data: UnlockCodeFormValues) => {
    verifyUnlockCode(
      { requestId, code: data.code },
      {
        onSuccess: () => {
          setStep('success');
        },
      },
    );
  };

  const handleResendCode = () => {
    sendUnlockCode({ requestId, method: selectedMethod });
  };

  const handleBackToSelectMethod = () => setStep('select-method');
  const handleBackToLogin = () => navigate({ to: '/auth' });
  const handleContinue = () => navigate({ to: '/auth' });

  const selectedDestination = unlockOptions.find((o) => o.type === selectedMethod)?.destination || '';

  return {
    step,
    unlockOptions,
    selectedMethod,
    selectedDestination,
    onMethodSelect: handleMethodSelect,
    onCodeVerify: handleCodeVerify,
    onResendCode: handleResendCode,
    onBackToSelectMethod: handleBackToSelectMethod,
    onBackToLogin: handleBackToLogin,
    onContinue: handleContinue,
  };
}
