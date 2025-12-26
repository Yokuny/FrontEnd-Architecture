import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { EnterpriseSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiExternalForm } from './@hooks/use-api-external-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-api-external/')({
  component: SetupApiExternalPage,
  validateSearch: searchSchema,
});

function SetupApiExternalPage() {
  const { t } = useTranslation();
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-api-external/' });
  const [showKey, setShowKey] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<string | undefined>(idEnterpriseQuery);

  const { form, onSubmit, isLoading, isPending } = useApiExternalForm({
    idEnterprise: selectedEnterprise,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const windyKeyValue = watch('windyKey');
  const isKeyMasked = windyKeyValue?.includes('***');

  const handleEnterpriseChange = (value: string | undefined) => {
    setSelectedEnterprise(value);
    if (value) {
      setValue('idEnterprise', value);
    }
  };

  return (
    <Card>
      <CardHeader title={t('setup.api.external')} />
      <form onSubmit={onSubmit}>
        <CardContent>
          {!idEnterpriseQuery && (
            <div className="space-y-2">
              <EnterpriseSelect mode="single" value={selectedEnterprise} onChange={handleEnterpriseChange} />
              {errors.idEnterprise && <p className="text-sm text-destructive">{t(errors.idEnterprise.message || '')}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="windyKey">API Key Windy *</Label>
            <div className="relative">
              <Input id="windyKey" type={showKey ? 'text' : 'password'} {...register('windyKey')} placeholder="API KEY" disabled={isLoading || isPending} className="pr-10" />
              <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.windyKey && <p className="text-sm text-destructive">{t(errors.windyKey.message || '')}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || isPending || isKeyMasked}>
            <Save className="mr-2 size-4" />
            {t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
