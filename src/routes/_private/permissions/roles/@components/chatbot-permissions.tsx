import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useChatbotPermissions } from '@/hooks/use-roles-api';
import type { RoleFormData } from '../@interface/role';

interface ChatbotPermissionsProps {
  form: UseFormReturn<RoleFormData>;
}

export function ChatbotPermissions({ form }: ChatbotPermissionsProps) {
  const { t } = useTranslation();
  const { data: permissions, isLoading } = useChatbotPermissions();

  if (isLoading) {
    return <div className="text-muted-foreground">{t('loading')}</div>;
  }

  return (
    <div className="space-y-4">
      {permissions?.map((permission) => {
        const value = form.watch(permission.value as keyof RoleFormData);
        return (
          <div key={permission.value} className="flex items-center space-x-2">
            <Checkbox id={`chatbot-${permission.value}`} checked={!!value} onCheckedChange={(checked) => form.setValue(permission.value as keyof RoleFormData, !!checked as any)} />
            <Label htmlFor={`chatbot-${permission.value}`} className="cursor-pointer">
              {t(permission.code)}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
