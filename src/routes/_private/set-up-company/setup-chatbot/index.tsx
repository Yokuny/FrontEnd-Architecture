import { createFileRoute, useSearch } from '@tanstack/react-router';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import DefaultLoading from '@/components/default-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { SetupChatbotForm } from './@components/setup-chatbot-form';
import { useSetupChatbotForm } from './@hooks/use-setup-chatbot-form';

const searchSchema = z.object({
  id: z.string().optional(),
});

export const Route = createFileRoute('/_private/set-up-company/setup-chatbot/')({
  component: SetupChatbotPage,
  validateSearch: searchSchema,
  beforeLoad: () => ({
    title: 'setup.chatbot',
  }),
});

function SetupChatbotPage() {
  const { id: idEnterpriseQuery } = useSearch({ from: '/_private/set-up-company/setup-chatbot/' });

  return <SetupChatbotFormContent idEnterprise={idEnterpriseQuery} />;
}

function SetupChatbotFormContent({ idEnterprise }: { idEnterprise?: string }) {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading, isPending } = useSetupChatbotForm({
    idEnterprise,
  });

  return (
    <Card>
      <CardHeader title={t('setup.chatbot')} />
      <CardContent>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <SetupChatbotForm isEnterpriseDisabled={!!idEnterprise} />
              <CardFooter className="px-0 pt-6 mt-6 border-t">
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
