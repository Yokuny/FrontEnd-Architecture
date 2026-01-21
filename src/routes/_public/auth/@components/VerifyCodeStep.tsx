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
        <div className="mx-auto mb-4 bg-amber-500/10 p-4 rounded-2xl w-fit border border-amber-500/20">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">{t('unlock.code.title')}</h1>
        <p className="text-muted-foreground text-sm text-balance">{t('unlock.code.subtitle', { destination })}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-center block">{t('unlock.code.label')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('add.code')}
                    className="h-14 text-center text-3xl font-bold tracking-[0.5em]"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="green" className="w-full mt-4 font-semibold text-base" size="lg">
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
          className="text-primary hover:text-primary/80 font-medium disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? t('resend.in', { seconds: resendCooldown }) : t('resend.code')}
        </Button>
      </div>
    </FieldGroup>
  );
}
