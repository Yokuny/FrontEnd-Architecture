import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/auth';

import { SignIn } from './@components/sign-in';
import { SignUp } from './@components/sign-up';

const authSearchSchema = z.object({
  interface: z.string().optional(),
});

type AuthSearchParams = z.infer<typeof authSearchSchema>;

export const Route = createFileRoute('/_public/auth/')({
  component: AuthenticationPage,
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => authSearchSchema.parse(search),
});

function AuthenticationPage() {
  const { interface: loginParam } = Route.useSearch();
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
          {loginParam === 'cadastro' ? <SignUp isLoading={isLoading} setIsLoading={setIsLoading} /> : <SignIn isLoading={isLoading} setIsLoading={setIsLoading} />}
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
