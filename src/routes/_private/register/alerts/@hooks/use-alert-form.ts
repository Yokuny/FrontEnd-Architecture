import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAlert, useAlertsApi } from '@/hooks/use-alerts-api';
import { type AlertFormData, alertFormSchema } from '../@interface/alert';
import { Route } from '../add';

export function useAlertForm() {
  const { t } = useTranslation();
  const navigate = Route.useNavigate();
  const { id, duplicate } = Route.useSearch();
  const { createUpdate, remove } = useAlertsApi();

  const { data: initialData, isLoading: isLoadingData } = useAlert(id || null);

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      type: 'conditional',
      visibility: 'private',
      edit: 'private',
      sendBy: [],
      users: [],
      scales: [],
      idMachines: [],
      // rule: { and: [{ or: [{}] }] }, // Initial rule structure
      events: {
        description: '',
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      const isDuplicate = duplicate === 'true';

      const formData: AlertFormData = {
        ...initialData,
        idEnterprise: initialData.idEnterprise || initialData.enterprise?.id || '',
        id: isDuplicate ? undefined : initialData.id,
        description: isDuplicate ? `${initialData.description || ''} (${t('copy')})` : initialData.description,
        type: initialData.type as any, // Cast if enum mismatch
        idsMinMax: initialData.idsMinMax || [],
        idMachines: initialData.idMachines || [],
        users: initialData.users || [],
        scales: initialData.scales || [],
        sendBy: initialData.sendBy || [],

        // Handle rule duplication for message
        rule: initialData.rule
          ? {
              ...initialData.rule,
              then: initialData.rule.then
                ? {
                    ...initialData.rule.then,
                    message: isDuplicate && initialData.rule.then.message ? `${initialData.rule.then.message} (${t('copy')})` : initialData.rule.then.message,
                  }
                : undefined,
            }
          : undefined,

        events: initialData.events
          ? {
              ...initialData.events,
              description: isDuplicate && initialData.events.description ? `${initialData.events.description} (${t('copy')})` : initialData.events.description,
            }
          : undefined,
      };

      form.reset(formData);
    }
  }, [initialData, form, duplicate, t]);

  const onSubmit = async (data: AlertFormData) => {
    try {
      if (!data.idEnterprise) {
        toast.error(t('enterprise.required'));
        return;
      }

      await createUpdate.mutateAsync(data);
      toast.success(t('save.successfull'));
      navigate({ to: '/register/alerts', search: { page: 1, size: 10 } } as any);
    } catch (error) {
      console.error(error);
      toast.error(t('error.save'));
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await remove.mutateAsync(id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/register/alerts', search: { page: 1, size: 10 } } as any);
    } catch (error) {
      console.error(error);
      toast.error(t('error.delete'));
    }
  };

  return {
    form,
    onSubmit,
    handleDelete,
    isLoading: isLoadingData || createUpdate.isPending || remove.isPending,
    isEditing: !!id && !duplicate,
  };
}
