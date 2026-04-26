import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SaveIcon from '@/components/icons/Save.Icon';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { t } from '@/lib/helpers/translate.helper';
import { type PasswordUpdate, passwordUpdateSchema } from '@/lib/interfaces/schemas/user.schema';
import { useSettingsMutations } from '../profile/@hooks/use-settings-api';
import { AccessForm } from './@components/access-form';

export const Route = createFileRoute('/_private/settings/access/')({
  component: SettingsAccess,
  staticData: {
    title: t('access'),
    description: t('access.page.description'),
  },
});

export function SettingsAccess() {
  const { changePassword } = useSettingsMutations();

  const form = useForm<PasswordUpdate>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: PasswordUpdate) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t('password.mismatch'));
      return;
    }

    try {
      const result = await changePassword.mutateAsync({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      toast.success(result.message);
      form.reset();
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  return (
    <Card asPage>
      <CardHeader>
        <CardAction>
          <Button type="submit" form="access-form" disabled={changePassword.isPending}>
            {changePassword.isPending ? <Spinner className="size-4" /> : <SaveIcon className="size-4" />}
            <span className="sr-only md:not-sr-only">{t('password.update')}</span>
          </Button>
        </CardAction>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="access-form">
          <CardContent>
            <AccessForm form={form} isPending={changePassword.isPending} />
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
