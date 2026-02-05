import { createFileRoute } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EnterpriseSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetsPermissions } from './@components/assets-permissions';
import { ChatbotPermissions } from './@components/chatbot-permissions';
import { PathsSelector } from './@components/paths-selector';
import { VisibilitySettings } from './@components/visibility-settings';
import { useRoleForm } from './@hooks/use-role-form';

export const Route = createFileRoute('/_private/permissions/roles/add')({
  component: AddRolePage,
});

function AddRolePage() {
  const { t } = useTranslation();
  const { form, onSubmit, isPending } = useRoleForm();

  return (
    <Card>
      <CardHeader title={t('new.role')} />
      <form onSubmit={onSubmit}>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <EnterpriseSelect mode="single" value={form.watch('idEnterprise')} onChange={(val) => form.setValue('idEnterprise', val || '')} oneBlocked />
              {form.formState.errors.idEnterprise && <p className="text-destructive text-sm">{form.formState.errors.idEnterprise.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')} *</Label>
              <Input id="description" {...form.register('description')} placeholder={t('message.description.placeholder')} maxLength={150} />
              {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
            </div>
          </div>

          <Tabs defaultValue="pages" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pages" className="gap-2">
                <Monitor className="size-4" />
                {t('pages')}
              </TabsTrigger>
              <TabsTrigger value="machines" className="gap-2">
                <Settings className="size-4" />
                {t('assets')}
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
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('saving') : t('save')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
