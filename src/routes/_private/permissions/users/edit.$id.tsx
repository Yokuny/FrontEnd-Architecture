import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsersApi } from '@/hooks/use-users-api';
import { type User, userSchema } from './@interface/user';

export const Route = createFileRoute('/_private/permissions/users/edit/$id')({
  component: EditUserPage,
});

function EditUserPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { getUser, updateUser, deleteUser, disableUser, enableUser } = useUsersApi();

  const { data: user, isLoading } = getUser(id);

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    values: user,
  });

  const isDisabled = !!user?.disabledAt;
  const isOnlyContact = form.watch('isOnlyContact');
  const phone = form.watch('phone');

  const onSubmit = async (data: User) => {
    try {
      await updateUser.mutateAsync(data);
      toast.success(intl.formatMessage({ id: 'save.successfull' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success(intl.formatMessage({ id: 'delete.successfull' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.delete' }));
    }
  };

  const handleDisable = async () => {
    try {
      if (isDisabled) {
        await enableUser.mutateAsync(id);
        toast.success(intl.formatMessage({ id: 'user.enabled' }));
      } else {
        await disableUser.mutateAsync({ id, reason: 'Disabled by admin' });
        toast.success(intl.formatMessage({ id: 'user.disabled' }));
      }
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error' }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="edit.user" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">
                  <FormattedMessage id="account.name" /> *
                </Label>
                <Input id="name" {...form.register('name')} placeholder={intl.formatMessage({ id: 'account.name' })} maxLength={150} disabled={isDisabled} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>

              {/* Is System User */}
              <div className="flex items-center space-x-2">
                <Checkbox id="isOnlyContact" checked={!isOnlyContact} onCheckedChange={(checked) => form.setValue('isOnlyContact', !checked)} disabled={isDisabled} />
                <Label htmlFor="isOnlyContact" className="cursor-pointer">
                  <FormattedMessage id="user.system" />
                </Label>
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">
                  <FormattedMessage id="login.email" /> {!isOnlyContact && '*'}
                </Label>
                <Input id="email" type="email" {...form.register('email')} placeholder={intl.formatMessage({ id: 'login.email' })} disabled={isDisabled} />
                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <Input id="phone" {...form.register('phone')} placeholder="WhatsApp" disabled={isDisabled} />
              </div>

              {/* Language - TODO: Add language selector */}
              <div className="space-y-2">
                <Label htmlFor="language">
                  <FormattedMessage id="language" />
                </Label>
                <Input id="language" {...form.register('language')} placeholder={intl.formatMessage({ id: 'language' })} disabled={isDisabled} />
              </div>

              {/* Send Welcome Message */}
              {phone && (
                <div className="flex items-center space-x-2 md:col-span-2">
                  <Checkbox
                    id="isSentMessageWelcome"
                    checked={form.watch('isSentMessageWelcome')}
                    onCheckedChange={(checked) => form.setValue('isSentMessageWelcome', !!checked)}
                    disabled={isDisabled}
                  />
                  <Label htmlFor="isSentMessageWelcome" className="cursor-pointer">
                    <FormattedMessage id="sent.message.welcome" /> (WhatsApp)
                  </Label>
                </div>
              )}

              {/* User Types - TODO: Add user type selector */}
              <div className="space-y-2 md:col-span-2">
                <Label>
                  <FormattedMessage id="type" />
                </Label>
                <p className="text-sm text-muted-foreground">User type selector will be added here</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant={isDisabled ? 'default' : 'secondary'}>
                    <FormattedMessage id={isDisabled ? 'enable.user' : 'disable.user'} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <FormattedMessage id="confirmation" />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <FormattedMessage id={isDisabled ? 'enable.user.message' : 'disable.user.message'} />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <FormattedMessage id="cancel" />
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisable}>
                      <FormattedMessage id="confirm" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <FormattedMessage id="delete" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <FormattedMessage id="delete.confirmation" />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <FormattedMessage id="delete.message.default" />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <FormattedMessage id="cancel" />
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      <FormattedMessage id="delete" />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {!isDisabled && (
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
