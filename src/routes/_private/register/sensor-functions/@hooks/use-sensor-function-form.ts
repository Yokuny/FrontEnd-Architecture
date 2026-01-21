import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useSensorFunctionsApi } from '@/hooks/use-sensor-functions-api';
import { extractSensorsFromAlgorithm, validateAlgorithm } from '../@consts/sensor-function-utils';
import { type SensorFunctionFormData, sensorFunctionSchema } from '../@interface/sensor-function.schema';

export function useSensorFunctionForm(idEnterprise: string, initialData?: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createSensorFunction, updateSensorFunction, toggleSensorFunction } = useSensorFunctionsApi();

  const form = useForm<SensorFunctionFormData>({
    resolver: zodResolver(sensorFunctionSchema),
    values: initialData,
    defaultValues: {
      description: '',
      algorithm: '',
      idSensor: '',
      idMachines: [],
      enabled: true,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const errors = validateAlgorithm(data.algorithm);

    if (errors.length > 0) {
      for (const errorMsg of errors) {
        toast.error(errorMsg);
      }
      return;
    }

    const { algorithm, sensorsIn } = extractSensorsFromAlgorithm(data.algorithm);
    if (sensorsIn.length === 0) {
      toast.error(t('error.sensor.function'));
      return;
    }

    const payload = {
      idEnterprise,
      sensorsIn,
      algorithm,
      idMachines: data.idMachines,
      description: data.description,
      idSensor: data.idSensor,
      enabled: data.enabled,
    };

    try {
      if (initialData?.id || initialData?._id) {
        await updateSensorFunction.mutateAsync({
          id: initialData.id || initialData._id,
          data: payload,
        });
        toast.success(t('success.update'));
      } else {
        await createSensorFunction.mutateAsync(payload);
        toast.success(t('save.success'));
      }
      navigate({ to: '/register/sensor-functions' });
    } catch (_error) {
      toast.error(initialData?.id ? t('error.update') : t('error.save'));
    }
  });

  const onToggle = async () => {
    const id = initialData?.id || initialData?._id;
    if (!id) return;

    try {
      await toggleSensorFunction.mutateAsync(id);
      toast.success(t('save.success'));
      navigate({ to: '/register/sensor-functions' });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  };

  return {
    form,
    onSubmit,
    onToggle,
    isPending: createSensorFunction.isPending || updateSensorFunction.isPending || toggleSensorFunction.isPending,
  };
}
