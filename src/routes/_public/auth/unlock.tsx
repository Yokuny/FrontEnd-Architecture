import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { SelectMethodStep } from '@/routes/_public/auth/@components/SelectMethodStep';
import { UnlockSuccessStep } from '@/routes/_public/auth/@components/UnlockSuccessStep';
import { VerifyCodeStep } from '@/routes/_public/auth/@components/VerifyCodeStep';
import { useUnlockForm } from '@/routes/_public/auth/@hooks/use-unlock-form';
import { unlockSearchSchema } from '@/routes/_public/auth/@interface/unlock.types';

export const Route = createFileRoute('/_public/auth/unlock')({
  component: UnlockPage,
  validateSearch: unlockSearchSchema,
});

function UnlockPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_public/auth/unlock' }) as { r?: string };
  const requestId = search.r || '';

  const { step, unlockOptions, selectedDestination, onMethodSelect, onCodeVerify, onResendCode, onBackToSelectMethod, onBackToLogin, onContinue } = useUnlockForm({
    requestId,
  });

  // Redirect if no request ID
  useEffect(() => {
    if (!requestId) {
      navigate({ to: '/auth' });
    }
  }, [requestId, navigate]);

  // Don't render if no request ID
  if (!requestId) {
    return null;
  }

  const renderStep = () => {
    switch (step) {
      case 'select-method':
        return <SelectMethodStep options={unlockOptions} onSubmit={onMethodSelect} onBack={onBackToLogin} />;
      case 'verify-code':
        return <VerifyCodeStep destination={selectedDestination} onSubmit={onCodeVerify} onBack={onBackToSelectMethod} onResend={onResendCode} />;
      case 'success':
        return <UnlockSuccessStep onContinue={onContinue} />;
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">{renderStep()}</div>
    </AuthLayout>
  );
}
