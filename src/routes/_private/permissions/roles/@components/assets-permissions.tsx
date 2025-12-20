import type { UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { RoleFormData } from '../@interface/role';

interface AssetsPermissionsProps {
  form: UseFormReturn<RoleFormData>;
}

export function AssetsPermissions({ form }: AssetsPermissionsProps) {
  const allMachines = form.watch('allMachines');
  const allSensors = form.watch('allSensors');

  return (
    <div className="space-y-6">
      {/* Machines Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          <FormattedMessage id="permissions.machine" />
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="allMachines" checked={allMachines} onCheckedChange={(checked) => form.setValue('allMachines', !!checked)} />
          <Label htmlFor="allMachines" className="cursor-pointer">
            <FormattedMessage id="all.machines" />
          </Label>
        </div>
        {!allMachines && (
          <div className="ml-6 text-sm text-muted-foreground">
            {/* TODO: Add machine selector component */}
            <p>Machine selector will be added here</p>
          </div>
        )}
      </div>

      {/* Sensors Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">
          <FormattedMessage id="permissions.sensors" />
        </h3>
        <div className="flex items-center space-x-2">
          <Checkbox id="allSensors" checked={allSensors} onCheckedChange={(checked) => form.setValue('allSensors', !!checked)} />
          <Label htmlFor="allSensors" className="cursor-pointer">
            <FormattedMessage id="all.sensors" />
          </Label>
        </div>
        {!allSensors && (
          <div className="ml-6 text-sm text-muted-foreground">
            {/* TODO: Add sensor selector component */}
            <p>Sensor selector will be added here</p>
          </div>
        )}
      </div>
    </div>
  );
}
