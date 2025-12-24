import { createFileRoute } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetsPermissions } from './@components/assets-permissions';
import { ChatbotPermissions } from './@components/chatbot-permissions';
import { PathsSelector } from './@components/paths-selector';
import { VisibilitySettings } from './@components/visibility-settings';
import { useRoleForm } from './@hooks/use-role-form';

export const Route = createFileRoute('/_private/permissions/roles/edit/$id')({
  component: EditRolePage,
});

function EditRolePage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { form, onSubmit, handleDelete, isLoading, isPending } = useRoleForm(id);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center text-muted-foreground">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>{t('edit.role')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <EnterpriseSelect mode="single" value={form.watch('idEnterprise')} onChange={(val) => form.setValue('idEnterprise', val || '')} oneBlocked />
              {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')} *</Label>
              <Input id="description" {...form.register('description')} placeholder={t('message.description.placeholder')} maxLength={150} />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
          </div>

          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages" className="gap-2">
                <Monitor className="h-4 w-4" />
                {t('pages')}
              </TabsTrigger>
              <TabsTrigger value="machines" className="gap-2">
                <Settings className="h-4 w-4" />
                {t('machines')}
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-2">
                <Edit2 className="h-4 w-4" />
                {t('edit.role')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="mt-6">
              <PathsSelector form={form} />
            </TabsContent>

            <TabsContent value="machines" className="mt-6">
              <AssetsPermissions form={form} />
            </TabsContent>

            <TabsContent value="chatbot" className="mt-6">
              <ChatbotPermissions form={form} />
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <VisibilitySettings form={form} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
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
                <AlertDialogAction onClick={() => handleDelete()} className="bg-destructive text-destructive-foreground">
                  {t('delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isPending}>
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
