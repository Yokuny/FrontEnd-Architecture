import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { z } from 'zod';

import { EnterpriseSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmailConfigForm } from './@hooks/use-email-config-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-email/')({
  component: SetupEmailPage,
  validateSearch: searchSchema,
});

function SetupEmailPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-email/' });
  const [showPass, setShowPass] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | undefined>(idEnterpriseQuery);

  const { form, onSubmit, isLoading, isPending } = useEmailConfigForm({
    idEnterprise: selectedEnterprise,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const secureValue = watch('secure');

  const handleEnterpriseChange = (value: string | undefined) => {
    setSelectedEnterprise(value);
    if (value) {
      setValue('idEnterprise', value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="setup.email" defaultMessage="Configuração de Email" />
        </CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent>
          {!idEnterpriseQuery && (
            <div className="space-y-2">
              <EnterpriseSelect mode="single" value={selectedEnterprise} onChange={handleEnterpriseChange} />
              {errors.idEnterprise && (
                <p className="text-sm text-destructive">
                  <FormattedMessage id={errors.idEnterprise.message} />
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host *</Label>
              <Input id="host" type="text" {...register('host')} placeholder="smtp.example.com" disabled={isLoading || isPending} />
              {errors.host && (
                <p className="text-sm text-destructive">
                  <FormattedMessage id={errors.host.message} />
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port">Port *</Label>
                <Input id="port" type="number" {...register('port')} placeholder="587" disabled={isLoading || isPending} />
                {errors.port && (
                  <p className="text-sm text-destructive">
                    <FormattedMessage id={errors.port.message} />
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox id="secure" checked={secureValue} onCheckedChange={(checked) => setValue('secure', !!checked)} disabled={isLoading || isPending} />
                  <Label htmlFor="secure" className="text-sm">
                    Secure (SSL/TLS)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountname">Account Name</Label>
            <Input id="accountname" type="text" {...register('accountname')} placeholder="My Company" disabled={isLoading || isPending} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} placeholder="noreply@example.com" disabled={isLoading || isPending} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  <FormattedMessage id={errors.email.message} />
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input id="password" type={showPass ? 'text' : 'password'} {...register('password')} placeholder="••••••••" disabled={isLoading || isPending} className="pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  <FormattedMessage id={errors.password.message} />
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || isPending}>
            <Save className="mr-2 h-4 w-4" />
            <FormattedMessage id="save" defaultMessage="Salvar" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
