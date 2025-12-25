import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUsersApi } from '@/hooks/use-users-api';
import { passwordUpdateSchema } from '../@interface/user';

export interface UsePasswordFormReturn {
  form: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
}

export function usePasswordForm(id: string): UsePasswordFormReturn {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePassword } = useUsersApi();

  const form = useForm<any>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      idUser: id,
      newPassword: '',
    },
  });

  const onValid = async (data: any) => {
    try {
      await updatePassword.mutateAsync(data);
      toast.success(t('password.updated'));
      navigate({ to: '/permissions/users', search: { page: 1, pageSize: 10 } });
    } catch (_error) {
      toast.error(t('error.update.password'));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid),
    isPending: updatePassword.isPending,
  };
}
