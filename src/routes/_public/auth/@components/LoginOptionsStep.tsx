import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type LoginOption, type PasswordFormValues, passwordSchema } from '../@interface/login.types';
import { SSOButton } from './SSOButton';

interface LoginOptionsStepProps {
  email: string;
  loginOptions: LoginOption[];
  showPassword: boolean;
  onTogglePassword: () => void;
  onPasswordLogin: (data: PasswordFormValues) => void;
  onSSOLogin: (data: { token: string; idToken: string }) => void;
  onBack: () => void;
}

export function LoginOptionsStep({ loginOptions, showPassword, onTogglePassword, onPasswordLogin, onSSOLogin, onBack }: LoginOptionsStepProps) {
  const intl = useIntl();
  const navigate = useNavigate();

  const hasPassword = loginOptions.some((opt) => opt.isPassword);
  const ssoOption = loginOptions.find((opt) => opt.isSso);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  return (
    <div className="space-y-5">
      {hasPassword && ssoOption && (
        <p className="text-center text-sm text-zinc-400">
          <FormattedMessage id="login.with" defaultMessage="Sign in with" />
        </p>
      )}

      {ssoOption && <SSOButton onSuccess={onSSOLogin} />}

      {hasPassword && ssoOption && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/40 px-2 text-zinc-500">
              <FormattedMessage id="condition.or" defaultMessage="Or" />
            </span>
          </div>
        </div>
      )}

      {hasPassword && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPasswordLogin)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">
                    <FormattedMessage id="login.password" defaultMessage="Password" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={intl.formatMessage({ id: 'login.password.placeholder', defaultMessage: 'Enter your password' })}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 hover:bg-white/10 hover:border-white/20 focus-visible:border-blue-500 focus-visible:ring-blue-500/30 transition-all duration-200 pr-12"
                        autoFocus
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onTogglePassword}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hover:bg-transparent transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              <FormattedMessage id="login.button-text" defaultMessage="Sign In" />
            </Button>
          </form>
        </Form>
      )}

      <div className="flex items-center justify-between text-sm">
        <Button type="button" variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <FormattedMessage id="back" defaultMessage="Back" />
        </Button>

        {hasPassword && (
          <Button
            type="button"
            variant="link"
            onClick={() => navigate({ to: '/auth/reset-password' })}
            className="h-auto p-0 text-blue-400 hover:text-blue-300 transition-colors font-medium decoration-transparent hover:no-underline"
          >
            <FormattedMessage id="lost.password" defaultMessage="Forgot password?" />
          </Button>
        )}
      </div>
    </div>
  );
}
