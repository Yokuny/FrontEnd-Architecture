import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { usePlatformsApi } from '@/hooks/use-platforms-api';
import { type PlatformFormData, platformSchema } from '../@interface/platform.schema';

export function usePlatformForm(initialData?: Partial<PlatformFormData>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createPlatform, updatePlatform } = usePlatformsApi();

  const form = useForm<PlatformFormData>({
    resolver: zodResolver(platformSchema) as any,
    values: initialData as PlatformFormData,
    defaultValues: {
      id: initialData?.id,
      idEnterprise: initialData?.idEnterprise || '',
      name: initialData?.name || '',
      code: initialData?.code || '',
      acronym: initialData?.acronym || '',
      basin: initialData?.basin || '',
      type: initialData?.type || '',
      modelType: initialData?.modelType || '',
      operator: initialData?.operator || '',
      imo: initialData?.imo || '',
      mmsi: initialData?.mmsi || '',
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
      radius: initialData?.radius,
      ais: {
        distanceToBow: initialData?.ais?.distanceToBow,
        distanceToStern: initialData?.ais?.distanceToStern,
        distanceToStarboard: initialData?.ais?.distanceToStarboard,
        distanceToPortSide: initialData?.ais?.distanceToPortSide,
      },
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.id) {
        await updatePlatform.mutateAsync(data as any);
      } else {
        await createPlatform.mutateAsync(data as any);
      }
      toast.success(t('save.success'));
      navigate({ to: '/register/platform', search: { page: 1, size: 20 } });
    } catch {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isPending: createPlatform.isPending || updatePlatform.isPending,
  };
}
