import { ArrowLeft, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface RecaptchaStepProps {
  email: string;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  onVerify: (token: string | null) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function RecaptchaStep({ email, recaptchaRef, onVerify, onBack, isLoading }: RecaptchaStepProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel className="font-medium">{t('email')}</FieldLabel>
        <Input type="email" className="h-14" value={email} disabled />
      </Field>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex justify-center">
          <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={onVerify} theme="light" />
        </div>
      )}

      <Button type="button" variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 size-4" />
        {t('back')}
      </Button>
    </div>
  );
}
