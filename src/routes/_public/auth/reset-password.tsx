import { createFileRoute, useSearch } from '@tanstack/react-router';
import { AuthLayout } from '@/routes/_public/auth/@components/AuthLayout';
import { RequestStep } from '@/routes/_public/auth/@components/RequestStep';
import { ResetStep } from '@/routes/_public/auth/@components/ResetStep';
import { SuccessStep } from '@/routes/_public/auth/@components/SuccessStep';
import { useResetPasswordForm } from '@/routes/_public/auth/@hooks/use-reset-password-form';
import { resetSearchSchema } from '@/routes/_public/auth/@interface/reset-password.types';

export const Route = createFileRoute('/_public/auth/reset-password')({
  component: ResetPasswordPage,
  validateSearch: resetSearchSchema,
});

function ResetPasswordPage() {
  const search = useSearch({ from: '/_public/auth/reset-password' }) as { request?: string };
  const { step, requestId, onRequestSuccess } = useResetPasswordForm({ initialRequestId: search.request });

  const renderStep = () => {
    switch (step) {
      case 'request':
        return <RequestStep onSuccess={onRequestSuccess} />;
      case 'reset':
        return <ResetStep requestId={requestId} />;
      case 'success':
        return <SuccessStep />;
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
