import { useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';

export function SuccessStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        <div className="bg-green-500/10 p-6 rounded-full border border-green-500/20">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{t('email.recover.send')}</h2>
          <p className="text-muted-foreground">{t('email.send')}</p>
        </div>
        <Button onClick={() => navigate({ to: '/auth' })} variant="blue" className="w-full mt-4 font-semibold text-base" size="lg">
          {t('back.login')}
        </Button>
      </div>
    </FieldGroup>
  );
}
