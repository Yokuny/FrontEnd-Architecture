import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { LanguageFormSelect, TypeCredentialsSelect, UserTypeSelect } from '@/components/selects';
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
import { useUserForm } from './@hooks/use-user-form';

export const Route = createFileRoute('/_private/permissions/users/edit/$id')({
  component: EditUserPage,
});

function EditUserPage() {
  const { id } = Route.useParams();
  const { form, onSubmit, handleDelete, handleDisable, isLoading, isPending } = useUserForm(id);

  const user = form.getValues();
  const isDisabled = !!user.disabledAt;
  const isOnlyContact = form.watch('isOnlyContact');
  const phone = form.watch('phone');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">
            <FormattedMessage id="loading" defaultMessage="Loading..." />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="edit.user" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">
                <FormattedMessage id="account.name" /> *
              </Label>
              <Input id="name" {...form.register('name')} placeholder="Nome" maxLength={150} disabled={isDisabled} />
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
              <Input id="email" type="email" {...form.register('email')} placeholder="Email" disabled={isDisabled} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp</Label>
              <Input id="phone" {...form.register('phone')} placeholder="WhatsApp" disabled={isDisabled} />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <LanguageFormSelect disabled={isDisabled} value={form.watch('language')} onChange={(val) => form.setValue('language', val)} />
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

            {/* User Types */}
            <div className="space-y-2 md:col-span-2">
              <UserTypeSelect mode="multi" idEnterprise={user.idEnterprise} value={form.watch('types')} onChange={(vals) => form.setValue('types', vals)} disabled={isDisabled} />
            </div>

            {/* Credentials By */}
            <div className="space-y-2 md:col-span-2">
              <TypeCredentialsSelect mode="multi" value={form.watch('typeCredentials')} onChange={(vals) => form.setValue('typeCredentials', vals)} disabled={isDisabled} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? <FormattedMessage id="saving" defaultMessage="Salvando..." /> : <FormattedMessage id="save" />}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
