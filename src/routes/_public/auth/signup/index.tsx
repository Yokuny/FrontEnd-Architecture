import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { useAuthStore } from '@/hooks/auth';
import DentalEaseLogo from '../@components/dental-ease-logo';
import { SignUp } from './@components/sign-up';

export const Route = createFileRoute('/_public/auth/signup/')({
  component: SignUpPage,
});

function SignUpPage() {
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
      <div className="flex w-full items-center justify-between gap-4">
        <DentalEaseLogo />
        <ThemeSwitcher />
      </div>
      <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
        <SignUp isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </div>
  );
}
