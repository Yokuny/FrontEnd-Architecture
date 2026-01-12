import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAlertsApi } from '@/hooks/use-alerts-api';
import { type AlertFormData, alertFormSchema } from '../@interface/alert';

/**
 * Maps API data to Form data structure
 */
export function mapAlertToFormData(initialData: any, t: (key: string) => string, duplicate?: boolean): AlertFormData {
  const isDuplicate = duplicate === true;

  // Helper to map objects with 'id' or 'value' to simple strings
  const mapToIds = (items: any[] | undefined | null) => {
    if (!items) return [];
    return items.map((item) => (typeof item === 'string' ? item : item.id || item.value || item.sensorId || item));
  };

  return {
    ...initialData,
    idEnterprise: initialData.idEnterprise || initialData.enterprise?.id || '',
    id: isDuplicate ? undefined : initialData.id,
    description: isDuplicate ? `${initialData.description || ''} (${t('copy')})` : initialData.description,
    type: initialData.type as any,
    idsMinMax: mapToIds(initialData.idsMinMax),
    idMachines: mapToIds(initialData.idMachines),
    users: mapToIds(initialData.users),
    scales: mapToIds(initialData.scales),
    sendBy: initialData.sendBy || [],
    allMachines: initialData.allMachines || false,

    rule: initialData.rule
      ? {
          ...initialData.rule,
          inMinutes: initialData.rule.inMinutes ?? null,
          // biome-ignore lint/suspicious/noThenProperty: Legacy API structure requires 'then'
          then: initialData.rule.then
            ? {
                ...initialData.rule.then,
                message: isDuplicate && initialData.rule.then.message ? `${initialData.rule.then.message} (${t('copy')})` : initialData.rule.then.message,
                level: initialData.rule.then.level || '',
              }
            : undefined,
          and: initialData.rule.and?.map((and: any) => ({
            or: and.or?.map((or: any) => ({
              ...or,
              sensor: typeof or.sensor === 'object' ? or.sensor?.value || or.sensor?.id || or.sensor : or.sensor,
            })),
          })),
        }
      : undefined,

    events: initialData.events
      ? {
          ...initialData.events,
          description: isDuplicate && initialData.events.description ? `${initialData.events.description} (${t('copy')})` : initialData.events.description,
          startInsideInPlatformArea: initialData.events.startInsideInPlatformArea
            ? {
                ...initialData.events.startInsideInPlatformArea,
                idMachines: mapToIds(initialData.events.startInsideInPlatformArea.idMachines || (initialData as any).machines),
                idPlatforms: mapToIds(initialData.events.startInsideInPlatformArea.idPlatforms || (initialData as any).platforms),
              }
            : null,
          inOutGeofence: initialData.events.inOutGeofence
            ? {
                ...initialData.events.inOutGeofence,
                idMachines: mapToIds(initialData.events.inOutGeofence.idMachines || (initialData as any).machinesInOutGeofence),
                idGeofences: mapToIds(initialData.events.inOutGeofence.idGeofences || (initialData as any).geofences),
              }
            : null,
          lostConnectionSensor: initialData.events.lostConnectionSensor
            ? {
                ...initialData.events.lostConnectionSensor,
                idMachine:
                  typeof initialData.events.lostConnectionSensor.idMachine === 'object'
                    ? (initialData.events.lostConnectionSensor.idMachine as any)?.value || (initialData.events.lostConnectionSensor.idMachine as any)?.id
                    : initialData.events.lostConnectionSensor.idMachine || (initialData as any).machineLostConnectionSensor?.id,
                idSensors: mapToIds(initialData.events.lostConnectionSensor.idSensors || (initialData as any).sensorsLostConnectionSensor),
              }
            : null,
          statusDistancePort: initialData.events.statusDistancePort
            ? {
                ...initialData.events.statusDistancePort,
                idMachines: mapToIds(initialData.events.statusDistancePort.idMachines || (initialData as any).machinesStatusDistancePort),
              }
            : null,
        }
      : undefined,
  };
}

export function useAlertForm(initialData?: AlertFormData) {
  const { t } = useTranslation();
  const { createUpdate } = useAlertsApi();

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertFormSchema) as any,
    values: initialData,
    defaultValues: {
      type: 'conditional',
      visibility: 'private',
      edit: 'private',
      sendBy: [],
      users: [],
      scales: [],
      idMachines: [],
      idsMinMax: [],
      events: {
        description: '',
      },
      allMachines: false,
    },
  });

  const validateForm = (data: AlertFormData): boolean => {
    if (!data.idEnterprise) {
      toast.warning(t('enterprise.required'));
      return false;
    }

    if (data.type === 'conditional') {
      if (data.rule?.inMinutes !== undefined && data.rule?.inMinutes !== null) {
        if (data.rule.inMinutes < 0 || data.rule.inMinutes > 1440) {
          toast.warning(t('hours.outside.limit'));
          return false;
        }
      }
      if (!data.rule?.then?.message) {
        toast.warning(t('message.required'));
        return false;
      }
      if (!data.rule?.and?.length) {
        toast.warning(t('rule.less.one.required'));
        return false;
      }
    }

    if (data.type === 'min-max') {
      if (!data.idsMinMax?.length) {
        toast.warning(t('vessels.required.at.least.one'));
        return false;
      }
      if (!data.description?.trim()) {
        toast.warning(t('description.required'));
        return false;
      }
    }

    if (data.type === 'event') {
      const e = data.events;
      if (!e?.startInsideInPlatformArea && !e?.inOutGeofence && !e?.lostConnectionSensor && !e?.statusDistancePort) {
        toast.warning(t('events.required.at.least.one'));
        return false;
      }
      if (!e?.description?.trim()) {
        toast.warning(t('description.required'));
        return false;
      }
    }

    return true;
  };

  const onSubmit = async () => {
    const data = form.getValues();
    if (!validateForm(data)) {
      throw new Error('Validation failed');
    }

    // Final mapping before save to ensure only necessary data for the current type is sent
    const payload: any = {
      ...data,
      usersPermissionView: data.visibility === 'limited' ? data.usersPermissionView : [],
      rule: data.type === 'event' ? null : data.rule,
      events: data.type === 'event' ? data.events : null,
      idsMinMax: data.type === 'min-max' ? data.idsMinMax : [],
    };

    return createUpdate.mutateAsync(payload);
  };

  return {
    form,
    onSubmit,
    isPending: createUpdate.isPending,
  };
}
