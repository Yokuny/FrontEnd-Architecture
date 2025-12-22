import { createFileRoute } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings, Trash2 } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
  const { form, onSubmit, handleDelete, isLoading, isPending } = useRoleForm(id);

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
            <FormattedMessage id="edit.role" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <EnterpriseSelect mode="single" value={form.watch('idEnterprise')} onChange={(val) => form.setValue('idEnterprise', val || '')} oneBlocked />
              {form.formState.errors.idEnterprise && <p className="text-sm text-destructive">{form.formState.errors.idEnterprise.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                <FormattedMessage id="description" /> *
              </Label>
              <Input id="description" {...form.register('description')} placeholder={intl.formatMessage({ id: 'message.description.placeholder' })} maxLength={150} />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
          </div>

          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages" className="gap-2">
                <Monitor className="h-4 w-4" />
                <FormattedMessage id="pages" />
              </TabsTrigger>
              <TabsTrigger value="machines" className="gap-2">
                <Settings className="h-4 w-4" />
                <FormattedMessage id="machines" />
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-2">
                <Edit2 className="h-4 w-4" />
                <FormattedMessage id="edit.role" />
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
                <AlertDialogAction onClick={() => handleDelete()} className="bg-destructive text-destructive-foreground">
                  <FormattedMessage id="delete" />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit" disabled={isPending}>
            {isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
