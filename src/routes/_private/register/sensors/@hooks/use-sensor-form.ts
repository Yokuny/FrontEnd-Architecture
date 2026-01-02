import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSensorsApi } from '@/hooks/use-sensors-api';
import { type SensorFormData, sensorSchema } from '../@interface/sensor.schema';

export function useSensorForm(initialData?: Partial<SensorFormData>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createSensor, updateSensor } = useSensorsApi();

  const form = useForm<SensorFormData>({
    resolver: zodResolver(sensorSchema) as any,
    values: initialData as SensorFormData,
    defaultValues: {
      id: initialData?.id,
      idEnterprise: initialData?.idEnterprise || '',
      sensorId: initialData?.sensorId || '',
      sensor: initialData?.sensor || '',
      description: initialData?.description || '',
      type: initialData?.type || '',
      unit: initialData?.unit || '',
      valueMin: initialData?.valueMin,
      valueMax: initialData?.valueMax,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.id) {
        await updateSensor.mutateAsync(data as any);
      } else {
        await createSensor.mutateAsync(data as any);
      }
      toast.success(t('save.successfull'));
      navigate({ to: '/register/sensors' } as { to: string });
    } catch {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isPending: createSensor.isPending || updateSensor.isPending,
  };
}
