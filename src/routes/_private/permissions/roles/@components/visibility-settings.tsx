import type { UseFormReturn } from 'react-hook-form';
import { EditPermissionSelect, UserSamePermissionSelect, VisibilitySelect } from '@/components/selects';
import type { EditPermission, RoleFormData, Visibility } from '../@interface/role';

interface VisibilitySettingsProps {
  form: UseFormReturn<RoleFormData>;
}

export function VisibilitySettings({ form }: VisibilitySettingsProps) {
  const visibility = form.watch('visibility');
  const editPermission = form.watch('edit');
  const users = form.watch('users') || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VisibilitySelect mode="single" value={visibility} onChange={(value) => form.setValue('visibility', value as Visibility)} />
        <EditPermissionSelect mode="single" value={editPermission} onChange={(value) => form.setValue('edit', value as EditPermission)} />
      </div>

      {visibility === 'limited' && <UserSamePermissionSelect mode="multi" value={users} onChange={(newValues) => form.setValue('users', newValues)} label={undefined} />}
    </div>
  );
}
