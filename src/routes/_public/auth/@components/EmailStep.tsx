import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
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
              <FormLabel className="text-zinc-300 font-medium">
                <FormattedMessage id="login.email" defaultMessage="Email" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="email"
                    placeholder={intl.formatMessage({ id: 'login.email.placeholder', defaultMessage: 'Enter your email' })}
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
          <Checkbox
            id="remember"
            checked={rememberEmail}
            onCheckedChange={(checked) => onRememberChange(checked === true)}
            className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="remember" className="text-sm text-zinc-300 font-normal cursor-pointer">
            <FormattedMessage id="remember.email" defaultMessage="Remember email" />
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <FormattedMessage id="next" defaultMessage="Next" />
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
}
