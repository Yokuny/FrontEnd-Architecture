import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { type MaintenancePlanFormData, maintenancePlanFormSchema } from '../@interface/maintenance-plan';

export function useMaintenancePlanForm(initialData?: Partial<MaintenancePlanFormData>) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<MaintenancePlanFormData>({
    resolver: zodResolver(maintenancePlanFormSchema) as any,
    values: initialData as MaintenancePlanFormData,
    defaultValues: {
      id: initialData?.id,
      idEnterprise: initialData?.idEnterprise || '',
      description: initialData?.description || '',
      typeMaintenance: initialData?.typeMaintenance || '',
      daysNotice: initialData?.daysNotice ?? 0,
      durationDays: initialData?.durationDays ?? 0,
      maintanceCycle: initialData?.maintanceCycle,
      maintanceWear: initialData?.maintanceWear,
      servicesGrouped: initialData?.servicesGrouped || [],
      partsCycle: initialData?.partsCycle || [],
    },
  });

  const { mutateAsync: saveMaintenancePlan, isPending } = useMutation({
    mutationFn: (data: MaintenancePlanFormData) => {
      return api.post('/maintenanceplan', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-plans'] });
      toast.success('save.success');
      navigate({ to: '/register/maintenance-plans', search: { page: 1, size: 20 } });
    },
    onError: () => {
      toast.error('error.save');
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await saveMaintenancePlan(data);
  });

  return {
    form,
    onSubmit,
    isPending,
  };
}
