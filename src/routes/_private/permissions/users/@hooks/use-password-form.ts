import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
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
  const intl = useIntl();
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
      toast.success(intl.formatMessage({ id: 'password.updated' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.update.password' }));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid),
    isPending: updatePassword.isPending,
  };
}
