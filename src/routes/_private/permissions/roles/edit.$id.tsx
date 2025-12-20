import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRolesApi } from '@/hooks/use-roles-api';
import { AssetsPermissions } from './@components/assets-permissions';
import { ChatbotPermissions } from './@components/chatbot-permissions';
import { PathsSelector } from './@components/paths-selector';
import { VisibilitySettings } from './@components/visibility-settings';
import { type Role, roleSchema } from './@interface/role';

export const Route = createFileRoute('/_private/permissions/roles/edit/$id')({
  component: EditRolePage,
});

function EditRolePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const { getRole, updateRole, deleteRole } = useRolesApi();

  const { data: role, isLoading } = getRole(id);

  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    values: role,
  });

  const onSubmit = async (data: Role) => {
    try {
      await updateRole.mutateAsync(data);
      toast.success(intl.formatMessage({ id: 'save.successfull' }));
      navigate({ to: '/permissions/roles' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRole.mutateAsync({ id, idEnterprise: form.getValues('idEnterprise') });
      toast.success(intl.formatMessage({ id: 'delete.successfull' }));
      navigate({ to: '/permissions/roles' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.delete' }));
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
              <FormattedMessage id="edit.role" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">
                <FormattedMessage id="description" /> *
              </Label>
              <Input id="description" {...form.register('description')} placeholder={intl.formatMessage({ id: 'message.description.placeholder' })} maxLength={150} />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
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
          <CardFooter className="flex justify-between">
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

            <Button type="submit" disabled={updateRole.isPending}>
              {updateRole.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
