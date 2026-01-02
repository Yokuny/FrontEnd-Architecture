import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMachinesApi } from '@/hooks/use-machines-api';
import { type MachineFormData, machineFormSchema } from '../@interface/machine.interface';

export function useMachineForm(initialData?: MachineFormData) {
  const { createMachine, updateMachine } = useMachinesApi();

  const form = useForm<MachineFormData>({
    resolver: zodResolver(machineFormSchema),
    defaultValues: initialData || {
      sensors: [],
      parts: [],
      maintenancePlans: [],
      dataSheet: {},
      contacts: [],
      cameras: [{ name: '', link: '' }],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (initialData?._id) {
      return await updateMachine.mutateAsync(data);
    } else {
      return await createMachine.mutateAsync(data);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMachine.isPending || updateMachine.isPending,
  };
}
