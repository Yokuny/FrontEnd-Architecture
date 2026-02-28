import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

import DefaultLoading from '@/components/default-loading';
import { Skeleton } from '@/components/ui/skeleton';
import { usePasskeyQuery } from '@/query/passkey';

import { FinishSignupForm } from './@components/finish-signup-form';

export const Route = createFileRoute('/_public/auth/finish-signup/$code/')({
  component: FinishSignupPage,
});

function FinishSignupPage() {
  const { code } = Route.useParams();
  const { data, isLoading, error } = usePasskeyQuery(code);

  if (error) {
    toast.error(error.message || 'Link de cadastro inválido ou expirado');
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Não foi possível carregar as informações de cadastro.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-between lg:p-8">
        <div className="flex h-full w-full max-w-96 flex-col items-center justify-center space-y-6">
          <div className="mb-6 flex w-full flex-col items-center space-y-4 text-center">
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="w-full space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (data?.content?.email) {
    return (
      <div className="mb-10 flex h-full flex-col items-center justify-between lg:p-8">
        <div className="flex h-full w-full max-w-96 justify-center">
          <FinishSignupForm userEmail={data.content.email} passkeyId={data.id} />
        </div>
      </div>
    );
  }

  return <DefaultLoading />;
}
