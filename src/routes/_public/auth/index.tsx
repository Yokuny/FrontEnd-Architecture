import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/auth';
import { SignIn } from './@components/sign-in';

export const Route = createFileRoute('/_public/auth/')({
  component: SignInPage,
});

function SignInPage() {
  const navigate = Route.useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
      <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
        <SignIn isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </div>
  );
}
