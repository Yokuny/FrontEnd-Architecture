import { ArrowLeft, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage } from 'react-intl';
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
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel className="text-zinc-300 font-medium">
          <FormattedMessage id="login.email" defaultMessage="Email" />
        </FieldLabel>
        <Input type="email" value={email} disabled className="h-12 bg-white/5 border-white/10 text-white opacity-60" />
      </Field>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex justify-center">
          <ReCAPTCHA ref={recaptchaRef} sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''} onChange={onVerify} theme="dark" />
        </div>
      )}

      <Button type="button" variant="ghost" onClick={onBack} className="w-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <FormattedMessage id="back" defaultMessage="Back" />
      </Button>
    </div>
  );
}
