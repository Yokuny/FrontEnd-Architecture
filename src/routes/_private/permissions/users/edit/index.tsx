import { createFileRoute } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useUserForm } from '../@hooks/use-user-form';

const editUserSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute('/_private/permissions/users/edit/')({
  component: EditUserPage,
  validateSearch: (search) => editUserSearchSchema.parse(search),
});

function EditUserPage() {
  const { t } = useTranslation();
  const { id } = Route.useSearch();
  const { form, onSubmit, handleDelete, handleDisable, isLoading, isPending } = useUserForm(id);

  const user = form.getValues();
  const isDisabled = !!user.disabledAt;
  const isOnlyContact = form.watch('isOnlyContact');
  const phone = form.watch('phone');

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.user')} />
        <CardContent className="p-12">
          <Skeleton className="h-48 w-full flex items-center justify-center">
            <Spinner />
          </Skeleton>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader title={t('edit.user')} />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">{t('account.name')} *</Label>
              <Input id="name" {...form.register('name')} placeholder={t('account.name.placeholder')} maxLength={150} disabled={isDisabled} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{t(form.formState.errors.name.message)}</p>}
            </div>

            {/* Is System User */}
            <div className="flex items-center space-x-2">
              <Checkbox id="isOnlyContact" checked={!isOnlyContact} onCheckedChange={(checked) => form.setValue('isOnlyContact', !checked)} disabled={isDisabled} />
              <Label htmlFor="isOnlyContact" className="cursor-pointer">
                {t('user.system')}
              </Label>
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">
                {t('login.email')} {!isOnlyContact && '*'}
              </Label>
              <Input id="email" type="email" {...form.register('email')} placeholder={t('login.email.placeholder')} disabled={isDisabled} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{t(form.formState.errors.email.message)}</p>}
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
                  {t('sent.message.welcome')} (WhatsApp)
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
                  {t(isDisabled ? 'enable.user' : 'disable.user')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirmation')}</AlertDialogTitle>
                  <AlertDialogDescription>{t(isDisabled ? 'enable.user.message' : 'disable.user.message')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDisable}>{t('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 size-4" />
                  {t('delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete.confirmation')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('delete.message.default')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {!isDisabled && (
            <Button type="submit" disabled={isPending}>
              {isPending ? t('saving') : t('save')}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
