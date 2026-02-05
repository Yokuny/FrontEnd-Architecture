import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { EditPermissionSelect, UserSamePermissionSelect, VisibilitySelect } from '@/components/selects';
import type { EditPermission, RoleFormData, Visibility } from '../@interface';

interface VisibilitySettingsProps {
  form: UseFormReturn<RoleFormData>;
}

export function VisibilitySettings({ form }: VisibilitySettingsProps) {
  const { t } = useTranslation();
  const visibility = form.watch('visibility');
  const editPermission = form.watch('edit');
  const users = form.watch('users') || [];

  return (
    <DefaultFormLayout
      layout="horizontal"
      sections={[
        {
          title: t('roles.visibility.title', 'Visibilidade e Edição'),
          description: t('roles.visibility.description', 'Configure quem pode visualizar e editar este perfil de acesso'),
          fields: [
            <div key="visibility-content" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <VisibilitySelect mode="single" value={visibility} onChange={(value) => form.setValue('visibility', value as Visibility)} />
                <EditPermissionSelect mode="single" value={editPermission} onChange={(value) => form.setValue('edit', value as EditPermission)} />
              </div>

              {visibility === 'limited' && (
                <div className="border-t pt-4">
                  <UserSamePermissionSelect mode="multi" value={users} onChange={(newValues) => form.setValue('users', newValues)} label={undefined} />
                </div>
              )}
            </div>,
          ],
        },
      ]}
    />
  );
}
