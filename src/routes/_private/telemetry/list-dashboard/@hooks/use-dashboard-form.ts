import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Dashboard } from '../@interface/dashboard.types';
import { type DashboardFormValues, dashboardFormSchema } from '../@interface/dashboard-form.schema';

export function useDashboardForm(dashboard?: Dashboard) {
  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(dashboardFormSchema),
    defaultValues: {
      description: '',
      idEnterprise: '',
      typeData: 'dashboard',
      typeLayout: 'simple',
      visibility: 'private',
      edit: 'me',
      users: [],
      idMachines: [],
      urlExternal: '',
    },
  });

  useEffect(() => {
    if (dashboard) {
      form.reset({
        id: dashboard.id,
        description: dashboard.description || dashboard.name,
        idEnterprise: dashboard.enterprise?.id || '',
        typeData: dashboard.typeData as any,
        idFolder: dashboard.folder?.id || null,
        typeLayout: (dashboard.typeLayout as any) || 'simple',
        visibility: dashboard.visibility?.toLowerCase() || 'private',
        edit: (dashboard as any).edit || 'me',
        users: dashboard.usersData?.map((u) => u.id) || [],
        idMachines: dashboard.machines?.map((m) => m.id) || [],
        urlExternal: (dashboard as any).urlExternal || '',
      });
    }
  }, [dashboard, form]);

  return { form };
}
