import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Shield } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
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
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 bg-linear-to-br from-amber-500/20 to-amber-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">{t('unlock.code.title')}</CardTitle>
        <CardDescription className="text-zinc-400">{t('unlock.code.subtitle', { destination })}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium text-center block">{t('unlock.code.label')}</FormLabel>
                  <FormControl>
                    <Field>
                      <Input
                        {...field}
                        placeholder={t('unlock.code.placeholder')}
                        className="h-14 text-center text-3xl font-bold tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-amber-500 focus-visible:ring-amber-500/30 transition-all duration-200"
                        autoComplete="one-time-code"
                        autoFocus
                        maxLength={10}
                      />
                    </Field>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {t('verify.code')}
            </Button>
          </form>
        </Form>
        <div className="flex items-center justify-between text-sm">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
          <Button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-amber-500 hover:text-amber-400 transition-colors font-medium disabled:text-zinc-600 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0 ? t('resend.in', { seconds: resendCooldown }) : t('resend.code')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
