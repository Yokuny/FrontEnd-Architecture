import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUserTypesApi } from '@/hooks/use-user-types-api';
import { type UserTypeFormData, userTypeSchema } from '../@interface/user-type.schema';

export function useUserTypeForm(initialData?: Partial<UserTypeFormData>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createUserType, updateUserType } = useUserTypesApi();

  const form = useForm<UserTypeFormData>({
    resolver: zodResolver(userTypeSchema),
    values: initialData as UserTypeFormData,
    defaultValues: {
      id: initialData?.id,
      description: initialData?.description || '',
      idEnterprise: initialData?.idEnterprise || '',
      color: initialData?.color || '#3366ff',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.id) {
        await updateUserType.mutateAsync(data as any);
      } else {
        await createUserType.mutateAsync(data as any);
      }
      toast.success(t('save.successfull'));
      navigate({ to: '/register/user-type' });
    } catch {
      toast.error(t('error.save'));
    }
  });

  return {
    form,
    onSubmit,
    isPending: createUserType.isPending || updateUserType.isPending,
  };
}
