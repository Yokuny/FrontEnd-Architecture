import type { UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EDIT_PERMISSION_OPTIONS, VISIBILITY_OPTIONS } from '../@consts/permissions';
import type { RoleFormData } from '../@interface/role';

interface VisibilitySettingsProps {
  form: UseFormReturn<RoleFormData>;
}

export function VisibilitySettings({ form }: VisibilitySettingsProps) {
  const visibility = form.watch('visibility');
  const editPermission = form.watch('edit');

  return (
    <div className="space-y-6">
      {/* Visibility Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          <FormattedMessage id="visibility" />
        </h3>
        <RadioGroup value={visibility} onValueChange={(value) => form.setValue('visibility', value as any)}>
          {VISIBILITY_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`visibility-${option.value}`} />
              <Label htmlFor={`visibility-${option.value}`} className="cursor-pointer">
                <FormattedMessage id={option.labelKey} />
              </Label>
            </div>
          ))}
        </RadioGroup>
        {visibility === 'limited' && (
          <div className="ml-6 text-sm text-muted-foreground">
            {/* TODO: Add user selector for limited visibility */}
            <p>User selector will be added here</p>
          </div>
        )}
      </div>

      {/* Edit Permission Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          <FormattedMessage id="edit.permission" />
        </h3>
        <RadioGroup value={editPermission} onValueChange={(value) => form.setValue('edit', value as any)}>
          {EDIT_PERMISSION_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`edit-${option.value}`} />
              <Label htmlFor={`edit-${option.value}`} className="cursor-pointer">
                <FormattedMessage id={option.labelKey} />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
