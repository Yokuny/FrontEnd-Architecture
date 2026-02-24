import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ThemeSwitcher } from '@/components/sidebar/switch-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GuestArea } from './@components/guest-area';
import { useAppLogin } from './@hooks/use-app-login';
import { type AppAuthFormData, appAuthSchema } from './@interface/app-auth.interface';

export const Route = createFileRoute('/_public/app-auth/')({
  component: AppAuthPage,
});

function AppAuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const login = useAppLogin();

  const form = useForm<AppAuthFormData>({
    resolver: zodResolver(appAuthSchema),
    defaultValues: { cpf: '', password: '' },
  });

  function applyCpfMask(value: string) {
    return value
      .replace(/\D+/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2');
  }

  function handleCpfChange(value: string) {
    form.setValue('cpf', applyCpfMask(value), { shouldValidate: true });
  }

  function onSubmit(data: AppAuthFormData) {
    login.mutate({ cpf: data.cpf, password: data.password });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1E3A5F] p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="flex flex-col items-center gap-4">
              <img src="/images/logo.svg" alt="Logo" className="h-16 w-auto" />
              <div className="flex w-full items-center justify-between">
                <h1 className="font-bold text-2xl">Acesso do Usuário</h1>
                <div className="flex gap-2">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">Digite seu CPF e senha para acessar</p>

            {isGuestMode ? (
              <GuestArea onClose={() => setIsGuestMode(false)} />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF *</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} onChange={(e) => handleCpfChange(e.target.value)} maxLength={14} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" {...field} />
                            <button type="button" className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={login.isPending}>
                    {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
              </Form>
            )}

            {!isGuestMode && (
              <button type="button" onClick={() => setIsGuestMode(true)} className="text-center text-muted-foreground text-sm underline hover:text-foreground">
                Visitante? Clique aqui para atualizar sua imagem
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
