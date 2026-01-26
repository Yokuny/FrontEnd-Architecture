import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type VoyageFormValues, voyageFormSchema } from '../@interface/schema';
import { useVoyage, useVoyageApi } from './use-kpis-travel-api';

interface UseVoyageFormProps {
  id?: string;
  redirect?: () => void;
}

export function useVoyageForm({ id, redirect }: UseVoyageFormProps) {
  const { t } = useTranslation();
  const { createVoyage, updateVoyage, deleteVoyage } = useVoyageApi();
  const { data: voyageData, isLoading: isLoadingData } = useVoyage(id || null);

  const form = useForm<VoyageFormValues>({
    resolver: zodResolver(voyageFormSchema),
    defaultValues: {
      code: '',
      asset: null as any,
      customer: null as any,
      load: [],
      compositionAsset: [],
      crew: [],
      itinerary: [],
      events: [],
      from: {},
      to: {},
    },
    values: voyageData
      ? {
          id: voyageData.id,
          code: voyageData.code || '',
          asset: voyageData.machine ? { value: voyageData.machine.id, label: voyageData.machine.name } : null,
          customer: voyageData.customer ? { value: voyageData.customer.value, label: voyageData.customer.label } : null,
          activity: voyageData.activity || '',
          goal: voyageData.goal || 0,
          observation: voyageData.metadata?.observation || '',
          itinerary: voyageData.itinerary || [],
          compositionAsset: voyageData.metadata?.compositionAsset || [],
          crew: voyageData.crew || [],
          events: voyageData.events || [],
          from: voyageData.metadata?.from || {},
          to: voyageData.metadata?.to || {},
          status: voyageData.status || '',
          travelType: voyageData.travelType || '',
        }
      : undefined,
  });

  const onSubmit = async (data: VoyageFormValues) => {
    try {
      const mutation = id ? updateVoyage : createVoyage;
      const payload = id ? { ...data, id } : data;

      await mutation.mutateAsync(payload as any);
      toast.success(t(id ? 'success.update' : 'success.save'));
      redirect?.();
    } catch {
      toast.error(t('error.save'));
    }
  };

  const onDelete = async (idToDelete: string) => {
    try {
      await deleteVoyage.mutateAsync(idToDelete);
      toast.success(t('success.delete'));
      redirect?.();
    } catch {
      toast.error(t('error.delete'));
    }
  };

  return {
    form,
    onSubmit,
    onDelete,
    isLoadingData,
  };
}
