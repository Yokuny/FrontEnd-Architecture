import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const hasPassword = loginOptions.some((opt) => opt.isPassword);
  const ssoOption = loginOptions.find((opt) => opt.isSso);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  return (
    <div className="space-y-5">
      {hasPassword && ssoOption && <p className="text-center text-muted-foreground text-sm">{t('login.with')}</p>}

      {ssoOption && <SSOButton onSuccess={onSSOLogin} />}

      {hasPassword && ssoOption && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t('condition.or')}</span>
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
                  <FormLabel className="font-medium">{t('login.password')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showPassword ? 'text' : 'password'} placeholder={t('login.password.placeholder')} className="h-14 pr-12" autoFocus />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onTogglePassword}
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="green" className="mt-4 w-full font-semibold text-base" size="lg">
              {t('login.button-text')}
            </Button>
          </form>
        </Form>
      )}

      <div className="flex items-center justify-between text-sm">
        <Button type="button" variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 size-4" />
          {t('back')}
        </Button>

        {hasPassword && (
          <Button type="button" variant="link" onClick={() => navigate({ to: '/auth/reset-password' })} className="h-auto p-0 font-medium text-primary hover:text-primary/80">
            {t('lost.password')}
          </Button>
        )}
      </div>
    </div>
  );
}
