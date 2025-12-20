import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsersApi } from '@/hooks/use-users-api';
import { type PasswordUpdate, passwordUpdateSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/password/$id')({
  component: UpdatePasswordPage,
});

function UpdatePasswordPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { updatePassword } = useUsersApi();

  const form = useForm<PasswordUpdate>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      idUser: id,
      newPassword: '',
    },
  });

  const onSubmit = async (data: PasswordUpdate) => {
    try {
      await updatePassword.mutateAsync(data);
      toast.success(intl.formatMessage({ id: 'password.updated' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.update.password' }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="new.password" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <FormattedMessage id="new.password.details" />
            </p>

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                <FormattedMessage id="new.password" /> *
              </Label>
              <Input id="newPassword" type="password" {...form.register('newPassword')} placeholder={intl.formatMessage({ id: 'new.password' })} />
              {form.formState.errors.newPassword && <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updatePassword.isPending}>
              {updatePassword.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
