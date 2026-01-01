import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGeofencesApi } from '@/hooks/use-geofences-api';
import { type GeofenceFormData, geofenceFormSchema } from '../@interface/geofence.interface';

export function useGeofenceForm(initialData?: Partial<GeofenceFormData>) {
  const { createGeofence, updateGeofence } = useGeofencesApi();

  const form = useForm<GeofenceFormData>({
    resolver: zodResolver(geofenceFormSchema) as any,
    defaultValues: {
      color: '#3366FF',
      initializeTravel: false,
      finalizeTravel: false,
      nearestPort: false,
      ...initialData,
    } as any,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.id) {
      await updateGeofence.mutateAsync({ ...data, id: data.id } as GeofenceFormData & { id: string });
    } else {
      await createGeofence.mutateAsync(data);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createGeofence.isPending || updateGeofence.isPending,
  };
}
