import { createFileRoute, Link } from '@tanstack/react-router';
import { ItemDescription } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { t } from '@/lib/helpers/translate.helper';
import { usePasskeyQuery } from '@/query/passkey';

import { FinishSignupForm } from './@components/finish-signup-form';

export const Route = createFileRoute('/_public/auth/finish-signup/$code/')({
  component: FinishSignupPage,
});

function FinishSignupPage() {
  const { code } = Route.useParams();
  const { data, isPending, isError, error } = usePasskeyQuery(code);

  if (isPending) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <Skeleton className="h-9 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="w-full space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <ItemDescription>{t('signup.load.error')}</ItemDescription>
            <Link to="/auth" className="font-medium text-foreground text-sm hover:underline">
              ← {t('back')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (data?.content?.email) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <FinishSignupForm userEmail={data.content.email} passkeyId={data.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
      <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <ItemDescription>{t('link.invalid.expired')}</ItemDescription>
          <Link to="/auth" className="font-medium text-foreground text-sm hover:underline">
            ← {t('back')}
          </Link>
        </div>
      </div>
    </div>
  );
}
