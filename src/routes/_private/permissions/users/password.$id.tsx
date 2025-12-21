import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUsersApi } from '@/hooks/use-users-api';

export const Route = createFileRoute('/_private/permissions/users/password/$id')({
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const { id } = Route.useParams();
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
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-12 pb-8">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {status === 'loading' && (
              <>
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
                </div>
                <p className="text-muted-foreground">
                  <FormattedMessage id="loading" defaultMessage="Carregando..." />
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-muted-foreground">
                  <FormattedMessage id="send.password.email" defaultMessage="E-mail de redefinição de senha enviado com sucesso." />
                </p>
                <Button variant="ghost" onClick={() => navigate({ to: '/permissions/users' })}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <FormattedMessage id="back" defaultMessage="Voltar" />
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-muted-foreground">
                  <FormattedMessage id="error.sent.email" defaultMessage="Erro ao enviar e-mail. Tente novamente." />
                </p>
                <Button variant="outline" onClick={handleRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <FormattedMessage id="try.again" defaultMessage="Tentar Novamente" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
