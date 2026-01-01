import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type Enterprise, useEnterprisesApi } from '@/hooks/use-enterprises-api';
import { type EnterpriseFormData, enterpriseSchema } from '../@interface/enterprise-form-data';

export function useEnterpriseForm(initialData?: EnterpriseFormData) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createEnterprise, updateEnterprise, uploadEnterpriseImage } = useEnterprisesApi();

  const form = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      address: '',
      zipCode: '',
      number: '',
      district: '',
      complement: '',
      city: '',
      state: '',
      country: 'Brazil',
      active: true,
    },
  });

  const { reset } = form;

  // Update form values when initialData is loaded
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // CEP lookup logic
  const zipCode = form.watch('zipCode');
  React.useEffect(() => {
    const fetchAddress = async (cep: string) => {
      try {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();

          if (data && !data.erro) {
            form.setValue('address', data.logradouro || '', { shouldValidate: true });
            form.setValue('district', data.bairro || '', { shouldValidate: true });
            form.setValue('city', data.localidade || '', { shouldValidate: true });
            form.setValue('state', data.uf || '', { shouldValidate: true });
            form.setValue('country', 'Brazil', { shouldValidate: true });
          }
        }
      } catch {
        // Silently fail if CEP lookup fails
      }
    };

    if (zipCode) {
      fetchAddress(zipCode);
    }
  }, [zipCode, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { lat, lon, image, imageDark, imagePreview, imagePreviewDark, ...rest } = values;
      const payload: Partial<Enterprise> = {
        ...rest,
        coordinate:
          lat !== undefined && lon !== undefined
            ? {
                latitude: Number(lat),
                longitude: Number(lon),
              }
            : undefined,
      };

      let result: Enterprise;
      if (values.id) {
        result = await updateEnterprise.mutateAsync(payload as Enterprise);
      } else {
        const response = await createEnterprise.mutateAsync(payload);
        result = (response as any).data || response;
      }

      const id = values.id || result.id;

      if (id) {
        if (image instanceof File) {
          await uploadEnterpriseImage.mutateAsync({ id, file: image });
        }
        if (imageDark instanceof File) {
          await uploadEnterpriseImage.mutateAsync({ id, file: imageDark, type: 'dark' });
        }
      }

      toast.success(t('save.successfull'));
      navigate({ to: '/register/enterprises', search: { page: 1, size: 10 } });
    } catch (_error) {
      // Error handling is managed by API client
    }
  });

  return {
    form,
    onSubmit,
    isPending: createEnterprise.isPending || updateEnterprise.isPending,
  };
}
