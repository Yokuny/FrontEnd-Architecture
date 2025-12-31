import { AlertCircle, CheckSquare, Edit, Eye, Shield, Slash, Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { UserSelect } from '@/components/selects/user-select';
import { VisibilitySelect } from '@/components/selects/visibility-select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { FormFormData } from '../@interface/form.schema';

interface FormPermissionsTabProps {
  form: UseFormReturn<FormFormData>;
  idEnterprise: string;
  markAsChanged: () => void;
}

export function FormPermissionsTab({ form, idEnterprise, markAsChanged }: FormPermissionsTabProps) {
  const { t } = useTranslation();
  const typeForm = form.watch('typeForm');

  const PermissionField = ({ label, visibilityName, usersName, icon: Icon }: { label: string; visibilityName: keyof FormFormData; usersName: keyof FormFormData; icon: any }) => {
    const visibility = form.watch(visibilityName);

    return (
      <div className="space-y-4 p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2 font-medium">
          <Icon className="size-4" />
          {label}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={visibilityName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('visibility')}</FormLabel>
                <FormControl>
                  <VisibilitySelect
                    mode="single"
                    value={field.value as string}
                    onChange={(val) => {
                      field.onChange(val);
                      markAsChanged();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {visibility === 'limited' && (
            <FormField
              control={form.control}
              name={usersName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users')}</FormLabel>
                  <FormControl>
                    <UserSelect
                      multi
                      idEnterprise={idEnterprise}
                      values={field.value as string[]}
                      onChangeMulti={(val) => {
                        field.onChange(val);
                        markAsChanged();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('permissions'),
          description: t('form.permissions.desc', 'Configure quem pode acessar e gerenciar este formulário'),
          fields: [
            <div className="space-y-6" key="permissions-grid">
              <PermissionField label={t('visible.placeholder')} visibilityName="viewVisibility" usersName="viewUsers" icon={Eye} />
              <PermissionField label={t('config.form')} visibilityName="editVisibility" usersName="editUsers" icon={Shield} />
              <PermissionField label={t('fill.form', 'Preencher formulário')} visibilityName="fillVisibility" usersName="fillUsers" icon={Edit} />
              <PermissionField label={t('delete.form.board')} visibilityName="deleteFormBoardVisibility" usersName="deleteFormBoardUsers" icon={Trash2} />
              <PermissionField label={t('edit.form.filling')} visibilityName="editFormFillingVisibility" usersName="editFormFillingUsers" icon={CheckSquare} />

              {typeForm === 'RVE' && <PermissionField label={t('justify')} visibilityName="justifyVisibility" usersName="justifyUsers" icon={AlertCircle} />}

              {['RDO', 'Sondagem', 'NOON_REPORT'].includes(typeForm || '') && (
                <PermissionField label={t('block')} visibilityName="blockVisibility" usersName="blockUsers" icon={Slash} />
              )}
            </div>,
          ],
        },
      ]}
    />
  );
}
