import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type Machine, useMachinesApi } from '@/hooks/use-machines-api';
import { type MachineFormData, machineFormSchema } from '../@interface/machine.interface';

function mapMachineToFormData(machine: Machine, _id?: string): MachineFormData {
  return {
    id: machine.id,
    _id: machine._id || _id,
    name: machine.name,
    code: machine.code || '',
    mmsi: machine.mmsi || '',
    imo: machine.imo || '',
    idEnterprise: machine.idEnterprise || machine.enterprise?.id || '',
    sensors:
      machine.sensors?.map((s) => ({
        value: s.sensorId,
        label: s.sensor,
        id: s.sensorId,
      })) || [],
    parts: machine.partsMachine?.map((p) => p.id) || [],
    maintenancePlans: machine.maintenancesPlan?.map((mp) => mp.id) || [],
    idModel: machine.modelMachine?.id || '',
    dataSheet: machine.dataSheet || {},
    contacts: machine.contacts || [],
    cameras: (machine.cameras as any) || [{ name: '', link: '' }],
    idFleet: machine.idFleet || '',
    inactiveAt: machine.inactiveAt || undefined,
  };
}

function mapFormDataToMachine(data: MachineFormData): Partial<Machine> {
  const { parts, maintenancePlans, sensors, idModel, ...rest } = data;
  return {
    ...rest,
    partsMachine: parts?.map((id) => ({ id, name: '' })),
    maintenancesPlan: maintenancePlans?.map((id) => ({ id, description: '' })),
    sensors: sensors?.map((s) => ({
      sensorId: s.value,
      sensor: s.label,
    })),
    modelMachine: idModel ? { id: idModel, description: '' } : undefined,
  } as Partial<Machine>;
}

export function useMachineForm(initialData?: Machine, initialId?: string) {
  const { createMachine, updateMachine } = useMachinesApi();

  const values = initialData ? mapMachineToFormData(initialData, initialId) : undefined;

  const form = useForm<MachineFormData>({
    resolver: zodResolver(machineFormSchema) as any,
    values: values as MachineFormData,
    defaultValues: {
      sensors: [],
      parts: [],
      maintenancePlans: [],
      dataSheet: {},
      contacts: [],
      cameras: [{ name: '', link: '' }],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const payload = mapFormDataToMachine(data);
    if (data._id) {
      return await updateMachine.mutateAsync(payload as any);
    } else {
      return await createMachine.mutateAsync(payload);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMachine.isPending || updateMachine.isPending,
  };
}
