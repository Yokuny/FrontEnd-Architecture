import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useGroupsApi } from '@/hooks/use-groups-api';
import { type Group, groupSchema } from '../@interface/groups.types';

export function useGroupForm(initialData?: Partial<Group>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createGroup, updateGroup } = useGroupsApi();

  const form = useForm<Group>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      subgroup: [{ name: '', description: '', details: [] }],
      ...initialData,
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.id || data._id) {
        await updateGroup.mutateAsync(data);
        toast.success(t('save.successfull'));
      } else {
        await createGroup.mutateAsync(data);
        toast.success(t('save.successfull'));
      }
      navigate({ to: '/operation/groups' });
    } catch {
      // Error handled by intercetor/tanstack query
    }
  });

  return {
    form,
    onSubmit,
    isPending: createGroup.isPending || updateGroup.isPending,
  };
}
