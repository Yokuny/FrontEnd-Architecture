import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRole, useRolesApi } from '@/hooks/use-roles-api';
import { type RoleFormData, roleSchema } from '../@interface/role';

export interface UseRoleFormReturn {
  form: UseFormReturn<RoleFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleDelete: (withUsers?: boolean) => Promise<void>;
  isLoading: boolean;
  isPending: boolean;
  isEdit: boolean;
}

export function useRoleForm(id?: string): UseRoleFormReturn {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { createRole, updateRole, deleteRole, deleteRoleWithUsers } = useRolesApi();

  const { data: role, isLoading: isLoadingRole } = useRole(id || '');

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema.omit({ id: true })) as any,
    values: role as RoleFormData | undefined,
    defaultValues: {
      description: '',
      idEnterprise: '',
      visibility: 'public',
      edit: 'admin',
      users: [],
      roles: [],
      allMachines: false,
      idMachines: [],
      allSensors: false,
      idSensors: [],
      interactChatbot: false,
      purchaseChatbot: false,
      notifyTravelWhatsapp: false,
      notifyTravelEmail: false,
      isShowStatusFleet: false,
      isShowConsumption: false,
      isShowStatus: false,
      isChangeStatusFleet: false,
      isSendLinkLocation: false,
      isNotifyEventVoyage: false,
      isAllowReceivedChangeStatus: false,
      isNotifyByChatbotAnomaly: false,
      isNotifyByMailAnomaly: false,
      isNotifyAlertOperational: false,
      isNotifyRVEDivergencies: false,
      isNotifyInsuranceDT: false,
    },
  });

  const onValid = async (data: RoleFormData) => {
    try {
      if (id) {
        await updateRole.mutateAsync({ ...data, id });
      } else {
        await createRole.mutateAsync(data);
      }
      toast.success(t('save.success'));
      navigate({ to: '/permissions/roles' });
    } catch (_error) {
      toast.error(t('error.save'));
    }
  };

  const handleDelete = async (withUsers = false) => {
    if (!id) return;

    try {
      const idEnterprise = form.getValues('idEnterprise');
      if (withUsers) {
        await deleteRoleWithUsers.mutateAsync({ idRole: id, idEnterprise });
      } else {
        await deleteRole.mutateAsync({ id, idEnterprise });
      }
      toast.success(t('delete.success'));
      navigate({ to: '/permissions/roles' });
    } catch (_error) {
      toast.error(t('role.request.error'));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onValid),
    handleDelete,
    isLoading: isLoadingRole,
    isPending: createRole.isPending || updateRole.isPending,
    isEdit: !!id,
  };
}
