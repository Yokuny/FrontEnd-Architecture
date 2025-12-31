import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { MachineByEnterpriseSelect, SensorByAssetsSelect } from '@/components/selects';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { RoleFormData } from '../@interface/role';

interface AssetsPermissionsProps {
  form: UseFormReturn<RoleFormData>;
}

export function AssetsPermissions({ form }: AssetsPermissionsProps) {
  const { t } = useTranslation();
  const allMachines = form.watch('allMachines');
  const allSensors = form.watch('allSensors');
  const idEnterprise = form.watch('idEnterprise');
  const idMachines = form.watch('idMachines');
  const idSensors = form.watch('idSensors');

  return (
    <DefaultFormLayout
      layout="horizontal"
      sections={[
        {
          title: t('permissions.machine'),
          description: t('roles.machines.description', 'Defina o acesso a máquinas específicas para este perfil'),
          fields: [
            <div key="machines-content" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="allMachines" checked={allMachines} onCheckedChange={(checked) => form.setValue('allMachines', !!checked)} />
                <Label htmlFor="allMachines" className="cursor-pointer">
                  {t('all.machines')}
                </Label>
              </div>
              {!allMachines && (
                <div className="space-y-2">
                  <MachineByEnterpriseSelect mode="multi" idEnterprise={idEnterprise} value={idMachines} onChange={(vals) => form.setValue('idMachines', vals)} label={undefined} />
                </div>
              )}
            </div>,
          ],
        },
        {
          title: t('permissions.sensors'),
          description: t('roles.sensors.description', 'Defina o acesso a sensores específicos para este perfil'),
          fields: [
            <div key="sensors-content" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="allSensors" checked={allSensors} onCheckedChange={(checked) => form.setValue('allSensors', !!checked)} />
                <Label htmlFor="allSensors" className="cursor-pointer">
                  {t('all.sensors')}
                </Label>
              </div>
              {!allSensors && (
                <div className="space-y-2">
                  <SensorByAssetsSelect mode="multi" idAssets={idMachines} value={idSensors} onChange={(vals) => form.setValue('idSensors', vals)} label={undefined} />
                </div>
              )}
            </div>,
          ],
        },
      ]}
    />
  );
}
