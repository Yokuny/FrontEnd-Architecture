import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useBuoysApi } from '@/hooks/use-buoys-api';
import { type BuoyFormData, buoySchema } from '../@interface/buoy';

export function useBuoyForm(initialData?: BuoyFormData) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveBuoy } = useBuoysApi();

  const form = useForm<BuoyFormData>({
    resolver: zodResolver(buoySchema) as any,
    values: initialData,
    defaultValues: {
      name: '',
      proximity: '',
      idEnterprise: '',
      latitude: 0,
      longitude: 0,
      delimitations: [{ color: '', name: '', radius: 0 }],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // Map form values to API payload
      const location = values.delimitations
        .map((delim) => ({
          type: 'Polygon',
          properties: { radius: delim.radius },
          geometry: {
            type: 'Point',
            coordinates: [values.longitude, values.latitude],
          },
          name: delim.name,
          color: delim.color,
          idDelimitation: delim.idDelimitation || uuidv4(),
        }))
        .sort((a: any, b: any) => a.properties.radius - b.properties.radius);

      const payload = {
        id: values.id,
        _id: values._id,
        name: values.name,
        proximity: values.proximity,
        idEnterprise: values.idEnterprise,
        color: '',
        location,
      };

      await saveBuoy.mutateAsync(payload);
      toast.success(t('save.successfull'));
      navigate({ to: '/register/buoy', search: { page: 1, size: 10 } });
    } catch (_error) {
      // API client handles error reporting
    }
  });

  return {
    form,
    onSubmit,
    isPending: saveBuoy.isPending,
  };
}
