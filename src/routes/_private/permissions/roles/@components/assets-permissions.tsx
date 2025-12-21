import type { UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { MachineByEnterpriseSelect, SensorByAssetsSelect } from '@/components/selects';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { RoleFormData } from '../@interface/role';

interface AssetsPermissionsProps {
  form: UseFormReturn<RoleFormData>;
}

export function AssetsPermissions({ form }: AssetsPermissionsProps) {
  const allMachines = form.watch('allMachines');
  const allSensors = form.watch('allSensors');
  const idEnterprise = form.watch('idEnterprise');
  const idMachines = form.watch('idMachines');
  const idSensors = form.watch('idSensors');

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
          <div className="space-y-2">
            <MachineByEnterpriseSelect
              mode="multi"
              idEnterprise={idEnterprise}
              value={idMachines}
              onChange={(vals) => form.setValue('idMachines', vals)}
              label={undefined} // Using internal label or FormattedMessage
            />
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
          <div className="space-y-2">
            <SensorByAssetsSelect mode="multi" idAssets={idMachines} value={idSensors} onChange={(vals) => form.setValue('idSensors', vals)} label={undefined} />
          </div>
        )}
      </div>
    </div>
  );
}
