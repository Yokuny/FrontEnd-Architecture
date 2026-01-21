import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useFuelTypesApi } from '@/hooks/use-fuel-types-api';
import { type TypeFuelFormData, typeFuelSchema } from '../@interface/type-fuel.schema';

export function useTypeFuelForm(initialData?: Partial<TypeFuelFormData>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createFuelType, updateFuelType } = useFuelTypesApi();

  const form = useForm<TypeFuelFormData>({
    resolver: zodResolver(typeFuelSchema) as any,
    values: initialData as TypeFuelFormData,
    defaultValues: {
      id: initialData?.id,
      idEnterprise: initialData?.idEnterprise || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      density: initialData?.density ?? 0,
      co2Coefficient: initialData?.co2Coefficient ?? 0,
      color: initialData?.color || '#3366ff',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.id) {
        await updateFuelType.mutateAsync(data as any);
      } else {
        await createFuelType.mutateAsync(data as any);
      }
      toast.success(t('save.success'));
      navigate({ to: '/register/type-fuel' });
    } catch {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isPending: createFuelType.isPending || updateFuelType.isPending,
  };
}
