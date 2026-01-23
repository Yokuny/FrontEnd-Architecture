import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type UnlockCodeFormValues, unlockCodeSchema } from '../@interface/unlock.types';

interface VerifyCodeStepProps {
  destination: string;
  onSubmit: (data: UnlockCodeFormValues) => void;
  onBack: () => void;
  onResend: () => void;
}

export function VerifyCodeStep({ destination, onSubmit, onBack, onResend }: VerifyCodeStepProps) {
  const { t } = useTranslation();
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<UnlockCodeFormValues>({
    resolver: zodResolver(unlockCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleResend = () => {
    onResend();
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <FieldGroup className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="mx-auto mb-4 w-fit rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="font-bold text-2xl">{t('unlock.code.title')}</h1>
        <p className="text-balance text-muted-foreground text-sm">{t('unlock.code.subtitle', { destination })}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-center font-medium">{t('unlock.code.label')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('add.code')}
                    className="h-14 text-center font-bold text-3xl tracking-[0.5em]"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="green" className="mt-4 w-full font-semibold text-base" size="lg">
            {t('verify.code')}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-between text-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 size-4" />
          {t('back')}
        </Button>
        <Button
          variant="link"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="font-medium text-primary hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          {resendCooldown > 0 ? t('resend.in', { seconds: resendCooldown }) : t('resend.code')}
        </Button>
      </div>
    </FieldGroup>
  );
}
