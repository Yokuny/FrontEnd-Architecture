import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Edit2, MessageCircle, Monitor, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { toast } from 'sonner';
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
import { type RoleFormData, roleSchema } from './@interface/role';

export const Route = createFileRoute('/_private/permissions/roles/add')({
  component: AddRolePage,
});

function AddRolePage() {
  const navigate = useNavigate();
  const intl = useIntl();
  const { createRole } = useRolesApi();

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema.omit({ id: true })),
    defaultValues: {
      description: '',
      idEnterprise: '',
      visibility: 'public',
      edit: 'admin',
      users: [],
      roles: [],
      allMachines: false,
      idMachines: [],
      allSensors: false,
      idSensors: [],
      interactChatbot: false,
      purchaseChatbot: false,
      notifyTravelWhatsapp: false,
      notifyTravelEmail: false,
      isShowStatusFleet: false,
      isShowConsumption: false,
      isShowStatus: false,
      isChangeStatusFleet: false,
      isSendLinkLocation: false,
      isNotifyEventVoyage: false,
      isAllowReceivedChangeStatus: false,
      isNotifyByChatbotAnomaly: false,
      isNotifyByMailAnomaly: false,
      isNotifyAlertOperational: false,
      isNotifyRVEDivergencies: false,
      isNotifyInsuranceDT: false,
    },
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      await createRole.mutateAsync(data);
      toast.success(intl.formatMessage({ id: 'save.successfull' }));
      navigate({ to: '/permissions/roles' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="new.role" />
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
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createRole.isPending}>
              {createRole.isPending ? <FormattedMessage id="saving" /> : <FormattedMessage id="save" />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
