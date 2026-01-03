import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type SetupFleetFormData, setupFleetSchema } from '../@interface/setup-fleet';
import { useSetupFleet, useSetupFleetApi } from './use-setup-fleet-api';

interface UseSetupFleetFormOptions {
  idEnterprise?: string;
}

export function useSetupFleetForm({ idEnterprise }: UseSetupFleetFormOptions) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: fleetData, isLoading: isLoadingData } = useSetupFleet(idEnterprise);
  const { updateFleet } = useSetupFleetApi();

  const form = useForm<SetupFleetFormData>({
    resolver: zodResolver(setupFleetSchema),
    defaultValues: {
      idEnterprise: idEnterprise || '',
      id: '',
      latitude: '',
      longitude: '',
      zoom: 0,
    },
  });

  useEffect(() => {
    if (fleetData) {
      form.reset({
        idEnterprise: idEnterprise || '',
        id: fleetData.id || '',
        latitude: fleetData.fleet?.center?.[0]?.toString() || '',
        longitude: fleetData.fleet?.center?.[1]?.toString() || '',
        zoom: fleetData.fleet?.zoom || 0,
      });
    }
  }, [fleetData, idEnterprise, form]);

  useEffect(() => {
    if (idEnterprise) {
      form.setValue('idEnterprise', idEnterprise);
    }
  }, [idEnterprise, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await updateFleet.mutateAsync({
        idEnterprise: data.idEnterprise,
        id: data.id,
        fleet: {
          center: data.latitude || data.longitude ? [Number.parseFloat(data.latitude), Number.parseFloat(data.longitude)] : null,
          zoom: data.zoom || 0,
        },
      });
      toast.success(t('success.save'));
      navigate({ to: '..' });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isLoading: isLoadingData,
    isPending: updateFleet.isPending,
  };
}
