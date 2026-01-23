import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';

interface UnlockSuccessStepProps {
  onContinue: () => void;
}

export function UnlockSuccessStep({ onContinue }: UnlockSuccessStepProps) {
  const { t } = useTranslation();

  return (
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="rounded-full border border-green-500/20 bg-green-500/10 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="font-bold text-2xl">{t('unlock.success.title')}</h2>
          <p className="text-muted-foreground">{t('unlock.success.subtitle')}</p>
        </div>
        <Button onClick={onContinue} variant="green" className="mt-4 w-full font-semibold text-base" size="lg">
          {t('unlock.continue')}
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </div>
    </FieldGroup>
  );
}
