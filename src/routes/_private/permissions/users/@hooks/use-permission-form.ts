import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useUserPermission, useUsersApi } from '@/hooks/use-users-api';
import { userPermissionSchema } from '../@interface/user';

export interface UsePermissionFormReturn {
  form: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleDelete: () => Promise<void>;
  isLoading: boolean;
  isPending: boolean;
  isEdit: boolean;
}

export function usePermissionForm(id?: string, idRef?: string): UsePermissionFormReturn {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addPermission, updatePermission, deletePermission } = useUsersApi();

  const { data: permissionData, isLoading: isLoadingPermission } = useUserPermission(id || '');

  const form = useForm<any>({
    resolver: zodResolver(userPermissionSchema),
    defaultValues: {
      idUser: idRef || '',
      idEnterprise: '',
      roles: [],
      isUserCustomer: false,
      customers: [],
    },
  });

  useEffect(() => {
    if (permissionData) {
      form.reset({
        id: permissionData.id,
        idUser: permissionData.idUser,
        idEnterprise: permissionData.enterprise?.id || '',
        roles: permissionData.role?.map((r: any) => r.id) || [],
        isUserCustomer: !!permissionData.customers?.length,
        customers: permissionData.customers?.map((c: any) => c.id) || [],
      });
    }
  }, [permissionData, form]);

  const onValid = async (data: any) => {
    try {
      if (id) {
        await updatePermission.mutateAsync(data);
        toast.success(t('save.successfull'));
      } else {
        await addPermission.mutateAsync(data);
        toast.success(t('save.successfull'));
      }
      navigate({ to: '/permissions/users', search: { page: 1, pageSize: 10 } });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePermission.mutateAsync(id);
      toast.success(t('delete.successfull'));
      navigate({ to: '/permissions/users', search: { page: 1, pageSize: 10 } });
    } catch (_error) {
      toast.error(t('error.delete'));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid),
    handleDelete,
    isLoading: isLoadingPermission,
    isPending: addPermission.isPending || updatePermission.isPending || deletePermission.isPending,
    isEdit: !!id,
  };
}
