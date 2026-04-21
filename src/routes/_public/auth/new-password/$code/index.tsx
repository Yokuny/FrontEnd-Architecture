import { createFileRoute, Link } from '@tanstack/react-router';

import DefaultLoading from '@/components/default-loading';
import { ItemDescription } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { t } from '@/lib/helpers/translate.helper';
import { usePasskeyQuery } from '@/query/passkey';

import { NewPasswordForm } from './@components/new-password-form';

export const Route = createFileRoute('/_public/auth/new-password/$code/')({
  component: NewPasswordPage,
});

function NewPasswordPage() {
  const { code } = Route.useParams();
  const { data, isLoading, error } = usePasskeyQuery(code);

  if (error) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <ItemDescription>{t('recovery.load.error')}</ItemDescription>
            <Link to="/auth/recovery" className="font-medium text-foreground text-sm hover:underline">
              ← {t('back')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-7 w-4/5" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="w-full space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.content?.email) {
    return (
      <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center gap-8">
          <div className="flex w-full flex-col gap-8">
            <NewPasswordForm userEmail={data.content.email} passkeyId={data.id} />
            <div className="text-center">
              <Link to="/auth" className="text-muted-foreground text-sm transition-colors hover:text-foreground hover:underline">
                ← {t('back')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DefaultLoading />;
}
