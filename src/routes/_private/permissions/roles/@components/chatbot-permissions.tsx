import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useChatbotPermissions } from '@/hooks/use-roles-api';
import type { RoleFormData } from '../@interface/role';

interface ChatbotPermissionsProps {
  form: UseFormReturn<RoleFormData>;
}

export function ChatbotPermissions({ form }: ChatbotPermissionsProps) {
  const { t } = useTranslation();
  const { data: permissions, isLoading } = useChatbotPermissions();

  if (isLoading) {
    return (
      <Skeleton className="flex h-32 w-full items-center justify-center">
        <Spinner />
      </Skeleton>
    );
  }

  return (
    <DefaultFormLayout
      layout="horizontal"
      sections={[
        {
          title: 'Chatbot',
          description: t('roles.chatbot.description', 'Configure as permissões de interação com o Chatbot'),
          fields: [
            <div key="chatbot-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {permissions?.map((permission) => {
                const value = form.watch(permission.value as keyof RoleFormData);
                return (
                  <div key={permission.value} className="flex items-center space-x-2 rounded-md border bg-card/50 p-2">
                    <Checkbox
                      id={`chatbot-${permission.value}`}
                      checked={!!value}
                      onCheckedChange={(checked) => form.setValue(permission.value as keyof RoleFormData, !!checked as any)}
                    />
                    <Label htmlFor={`chatbot-${permission.value}`} className="cursor-pointer font-medium text-sm">
                      {t(permission.code)}
                    </Label>
                  </div>
                );
              })}
            </div>,
          ],
        },
      ]}
    />
  );
}
