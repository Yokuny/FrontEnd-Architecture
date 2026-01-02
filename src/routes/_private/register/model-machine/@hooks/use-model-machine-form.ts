import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useModelMachinesApi } from '@/hooks/use-model-machines-api';
import { type ModelMachineFormData, modelMachineSchema } from '../@interface/model-machine';

export function useModelMachineForm(initialData?: ModelMachineFormData, options?: { onSuccess?: (id: string) => void }) {
  const { t } = useTranslation();
  const { saveModelMachine } = useModelMachinesApi();

  const form = useForm<ModelMachineFormData>({
    resolver: zodResolver(modelMachineSchema),
    values: initialData
      ? {
          ...initialData,
          color: initialData.color || '#ff3d71',
          typeMachine: (initialData.typeMachine as any) || 'ship',
        }
      : undefined,
    defaultValues: initialData || {
      idEnterprise: '',
      description: '',
      color: '#ff3d71',
      typeMachine: 'ship',
      specification: '',
    },
  });

  const onSubmit = async (data: ModelMachineFormData) => {
    try {
      const response = await saveModelMachine.mutateAsync(data);
      // The API returns { data: { message, code, data: { id } } } because of ApiClient wrapping
      const responseData = response as any;
      const id = responseData?.data?.data?.id || responseData?.data?.id || responseData?.id || data.id;

      if (options?.onSuccess && id) {
        options.onSuccess(id);
      }
      return id;
    } catch {
      toast.error(t('error.save'));
      throw new Error('Save failed');
    }
  };

  return {
    form,
    onSubmit,
    isPending: saveModelMachine.isPending,
  };
}
