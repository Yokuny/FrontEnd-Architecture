import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { DashboardFolderSelect } from '@/components/selects/dashboard-folder-select';
import { EditPermissionSelect } from '@/components/selects/edit-permission-select';
import { EnterpriseSelect } from '@/components/selects/enterprise-select';
import { MachineEnterpriseSelect } from '@/components/selects/machine-enterprise-select';
import { UserSelect } from '@/components/selects/user-select';
import { ViewSelect } from '@/components/selects/view-select';
import { VisibilitySelect } from '@/components/selects/visibility-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { DashboardFormValues } from '../@interface/dashboard-form.schema';

interface DashboardFormProps {
  form: UseFormReturn<DashboardFormValues>;
}

export function DashboardForm({ form }: DashboardFormProps) {
  const { t } = useTranslation();
  const idEnterprise = form.watch('idEnterprise');
  const typeData = form.watch('typeData');
  const visibility = form.watch('visibility');

  const sections = [
    {
      title: t('general.information'),
      fields: [
        <FormField
          key="idEnterprise"
          control={form.control}
          name="idEnterprise"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EnterpriseSelect mode="single" value={field.value} onChange={field.onChange} disabled={field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="description"
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('description')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('description')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="idMachines"
          control={form.control}
          name="idMachines"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MachineEnterpriseSelect mode="multi" idEnterprise={idEnterprise} value={field.value} onChange={field.onChange} disabled={field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
      ],
    },
    {
      title: t('configuration'),
      fields: [
        <FormField
          key="typeData"
          control={form.control}
          name="typeData"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ViewSelect mode="single" value={field.value} onChange={field.onChange} disabled={field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        ...(typeData !== 'folder'
          ? [
              <FormField
                key="idFolder"
                control={form.control}
                name="idFolder"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DashboardFolderSelect mode="single" idEnterprise={idEnterprise} value={field.value || undefined} onChange={field.onChange} disabled={field.disabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />,
            ]
          : []),
        ...(typeData === 'dashboard'
          ? [
              <FormField
                key="typeLayout"
                control={form.control}
                name="typeLayout"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ViewSelect mode="single" value={field.value} onChange={field.onChange} disabled={field.disabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />,
            ]
          : []),
        ...(typeData === 'url.external'
          ? [
              <FormField
                key="urlExternal"
                control={form.control}
                name="urlExternal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('url.external')} *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />,
            ]
          : []),
      ],
    },
    {
      title: t('permissions.visibility'),
      fields: [
        <FormField
          key="visibility"
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <VisibilitySelect mode="single" value={field.value} onChange={field.onChange} disabled={field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        <FormField
          key="edit"
          control={form.control}
          name="edit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <EditPermissionSelect mode="single" value={field.value} onChange={field.onChange} disabled={field.disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />,
        ...(visibility === 'limited'
          ? [
              <FormField
                key="users"
                control={form.control}
                name="users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('users')} *</FormLabel>
                    <FormControl>
                      <UserSelect multi idEnterprise={idEnterprise} values={field.value} onChangeMulti={field.onChange} disabled={field.disabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />,
            ]
          : []),
      ],
    },
  ];

  return <DefaultFormLayout sections={sections} />;
}
