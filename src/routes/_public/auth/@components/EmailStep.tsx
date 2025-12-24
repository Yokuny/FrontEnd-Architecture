import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type EmailFormValues, emailSchema } from '../@interface/login.types';

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  rememberEmail: boolean;
  onRememberChange: (remember: boolean) => void;
  onSubmit: () => void;
}

export function EmailStep({ email, onEmailChange, rememberEmail, onRememberChange, onSubmit }: EmailStepProps) {
  const { t } = useTranslation();
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  const handleSubmit = (data: EmailFormValues) => {
    onEmailChange(data.email);
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300 font-medium">{t('login.email')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder={t('login.email.placeholder')}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" checked={rememberEmail} onCheckedChange={(checked: boolean | 'indeterminate') => onRememberChange(checked === true)} variant="blue" />
          <Label htmlFor="remember" className="text-sm text-zinc-300 font-normal cursor-pointer">
            {t('remember.email')}
          </Label>
        </div>

        <Button type="submit" variant="blue" className="w-full font-semibold text-base" size="lg">
          {t('next')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
}
