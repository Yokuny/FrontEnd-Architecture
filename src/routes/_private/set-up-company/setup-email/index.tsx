import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { EmailConfigForm } from './@components/email-config-form';
import { useEmailConfigForm } from './@hooks/use-email-config-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-email/')({
  component: SetupEmailPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.email',
  }),
});

function SetupEmailPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-email/' });

  return <SetupEmailFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupEmailFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useEmailConfigForm({
    idEnterprise,
  });

  return (
    <Card>
      <CardHeader title={t('setup.email')} />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <EmailConfigForm isEnterpriseDisabled={!!idEnterprise} />
              <CardFooter className="mt-6 border-t px-0 pt-6">
                <Button type="submit" disabled={isPending || isLoading} className="min-w-[120px]">
                  {isPending ? <Spinner className="mr-2 size-4" /> : <Save className="mr-2 size-4" />}
                  {t('save')}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
