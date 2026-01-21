import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { SetupFleetForm } from './@components/setup-fleet-form';
import { useSetupFleetForm } from './@hooks/use-setup-fleet-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-fleet/')({
  component: SetupFleetPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.fleet',
  }),
});

function SetupFleetPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-fleet/' });

  return <SetupFleetFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupFleetFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useSetupFleetForm({
    idEnterprise,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={`${t('config')} Fleet`} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={`${t('config')} Fleet`} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            <SetupFleetForm isEnterpriseDisabled={!!idEnterprise} />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || isLoading} className="min-w-[120px]">
              {isPending ? <Spinner className="mr-2 size-4" /> : <Save className="mr-2 size-4" />}
              {t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
