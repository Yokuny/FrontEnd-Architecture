import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/auth';

import { SignUp } from '../@components/sign-up';

export const Route = createFileRoute('/_public/auth/signup/')({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = Route.useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const previousPage = () => window.history.back();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="w-full p-6 md:p-8">
      <div className="mb-10 flex h-full flex-col items-center justify-between">
        <div className="flex h-full w-full max-w-96 justify-center">
          <SignUp isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <Button disabled={isLoading} onClick={previousPage} variant="outline" className="group flex w-full max-w-96 gap-4">
            Voltar
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
