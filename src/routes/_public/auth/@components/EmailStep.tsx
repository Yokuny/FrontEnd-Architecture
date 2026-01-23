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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">{t('email')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input {...field} className="h-14" type="email" placeholder={t('login.email.placeholder')} autoFocus />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Mail className="size-5 text-muted-foreground" />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" variant="blue" checked={rememberEmail} onCheckedChange={(checked: boolean | 'indeterminate') => onRememberChange(checked === true)} />
          <Label htmlFor="remember" className="cursor-pointer font-normal text-sm">
            {t('remember.email')}
          </Label>
        </div>

        <Button type="submit" variant="blue" className="mt-4 w-full font-semibold text-base" size="lg">
          {t('next')}
          <ArrowRight className="ml-2 size-5" />
        </Button>
      </form>
    </Form>
  );
}
