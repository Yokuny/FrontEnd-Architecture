import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { useUser, useUsersApi } from '@/hooks/use-users-api';
import { userSchema } from '../@interface/user';

export interface UseUserFormReturn {
  form: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleDisable: () => Promise<void>;
  isLoading: boolean;
  isPending: boolean;
  isEdit: boolean;
}

export function useUserForm(id?: string): UseUserFormReturn {
  const navigate = useNavigate();
  const intl = useIntl();
  const { createUser, updateUser, deleteUser, disableUser, enableUser } = useUsersApi();

  const { data: user, isLoading: isLoadingUser } = useUser(id || '');

  const form = useForm<any>({
    resolver: zodResolver(userSchema),
    values: user,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      language: 'pt',
      isUser: true,
      isOnlyContact: false,
      isSentMessageWelcome: true,
      isUserCustomer: false,
      roles: [],
      types: [],
      customers: [],
      typeCredentials: ['password'],
      idEnterprise: '',
      disabledAt: null,
    },
  });

  const onValid = async (data: any) => {
    try {
      if (id) {
        await updateUser.mutateAsync({ ...data, id });
        toast.success(intl.formatMessage({ id: 'save.successfull' }));
      } else {
        await createUser.mutateAsync(data);
        toast.success(intl.formatMessage({ id: 'save.successfull' }));
      }
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.save' }));
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteUser.mutateAsync(id);
      toast.success(intl.formatMessage({ id: 'delete.successfull' }));
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error.delete' }));
    }
  };

  const handleDisable = async () => {
    if (!id) return;
    try {
      const isDisabled = !!user?.disabledAt;
      if (isDisabled) {
        await enableUser.mutateAsync(id);
        toast.success(intl.formatMessage({ id: 'user.enabled' }));
      } else {
        await disableUser.mutateAsync({ id, reason: 'Disabled by admin' });
        toast.success(intl.formatMessage({ id: 'user.disabled' }));
      }
      navigate({ to: '/permissions/users' });
    } catch (_error) {
      toast.error(intl.formatMessage({ id: 'error' }));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid),
    handleDelete,
    handleDisable,
    isLoading: isLoadingUser,
    isPending: createUser.isPending || updateUser.isPending || deleteUser.isPending || disableUser.isPending || enableUser.isPending,
    isEdit: !!id,
  };
}
