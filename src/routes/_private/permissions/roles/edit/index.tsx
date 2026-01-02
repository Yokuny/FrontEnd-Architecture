import { createFileRoute } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetsPermissions } from '../@components/assets-permissions';
import { ChatbotPermissions } from '../@components/chatbot-permissions';
import { PathsSelector } from '../@components/paths-selector';
import { VisibilitySettings } from '../@components/visibility-settings';
import { useRoleForm } from '../@hooks/use-role-form';

const editRoleSearchSchema = z.object({
  id: z.string(),
});

export const Route = createFileRoute('/_private/permissions/roles/edit/')({
  component: EditRolePage,
  validateSearch: (search) => editRoleSearchSchema.parse(search),
});

function EditRolePage() {
  const { id } = Route.useSearch();
  const { t } = useTranslation();
  const { form, onSubmit, handleDelete, isLoading, isPending } = useRoleForm(id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={t('edit.role')} />
        <CardContent className="p-12">
          <DefaultLoading />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={t('edit.role')} />
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="p-0">
            <DefaultFormLayout
              sections={[
                {
                  title: t('identification'),
                  description: t('role.identification.description', 'Identificação básica do perfil de acesso'),
                  fields: [
                    <FormField
                      key="idEnterprise"
                      control={form.control}
                      name="idEnterprise"
                      render={({ field }) => (
                        <FormItem>
                          <Field className="gap-2">
                            <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} oneBlocked />
                          </Field>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                    <FormField
                      key="description"
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <Field className="gap-2">
                            <FieldLabel>{t('description')}</FieldLabel>
                            <Input {...field} placeholder={t('message.description.placeholder')} maxLength={150} />
                          </Field>
                          <FormMessage />
                        </FormItem>
                      )}
                    />,
                  ],
                },
              ]}
            />

            <div className="px-6 pb-6 md:px-10 md:pb-10">
              <Tabs defaultValue="pages" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pages" className="gap-2">
                    <Monitor className="size-4" />
                    {t('pages')}
                  </TabsTrigger>
                  <TabsTrigger value="machines" className="gap-2">
                    <Settings className="size-4" />
                    {t('machines')}
                  </TabsTrigger>
                  <TabsTrigger value="chatbot" className="gap-2">
                    <MessageCircle className="size-4" />
                    Chatbot
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="gap-2">
                    <Edit2 className="size-4" />
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
            </div>
          </CardContent>
          <CardFooter layout="multi">
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
      </Form>
    </Card>
  );
}
