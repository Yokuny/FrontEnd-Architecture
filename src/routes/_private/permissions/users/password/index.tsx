import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUsersApi } from '@/hooks/use-users-api';

const updatePasswordSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute('/_private/permissions/users/password/')({
  component: UpdatePasswordPage,
  validateSearch: (search) => updatePasswordSearchSchema.parse(search),
});

function UpdatePasswordPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { sendPasswordResetEmail } = useUsersApi();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const sendResetEmail = async () => {
      setStatus('loading');
      try {
        await sendPasswordResetEmail.mutateAsync(id);
        setStatus('success');
      } catch (_error) {
        setStatus('error');
      }
    };
    sendResetEmail();
  }, [id, sendPasswordResetEmail]);

  const handleRetry = async () => {
    setStatus('loading');
    try {
      await sendPasswordResetEmail.mutateAsync(id);
      setStatus('success');
    } catch (_error) {
      setStatus('error');
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {status === 'loading' && (
            <>
              <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-muted">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">{t('loading')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-muted-foreground">{t('send.password.email')}</p>
              <Button variant="ghost" onClick={() => navigate({ to: '/permissions/users', search: { page: 1, pageSize: 10 } })}>
                <ArrowLeft className="mr-2 size-4" />
                {t('back')}
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-muted-foreground">{t('error.sent.email')}</p>
              <Button variant="outline" onClick={handleRetry}>
                <RefreshCw className="mr-2 size-4" />
                {t('try.again')}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
