import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { UserSelect } from '@/components/selects/user-select';
import { VisibilitySelect } from '@/components/selects/visibility-select';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import type { FormFormData } from '../@interface/form.schema';

interface FormPermissionsTabProps {
  form: UseFormReturn<FormFormData>;
  idEnterprise: string;
  markAsChanged: () => void;
}

export function FormPermissionsTab({ form, idEnterprise, markAsChanged }: FormPermissionsTabProps) {
  const { t } = useTranslation();
  const typeForm = form.watch('typeForm');

  const PermissionField = ({ label, visibilityName, usersName }: { label: string; visibilityName: keyof FormFormData; usersName: keyof FormFormData }) => {
    const visibility = form.watch(visibilityName);

    return (
      <Item>
        <ItemContent>
          <ItemTitle>{label}</ItemTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={visibilityName}
              render={({ field }) => (
                <FormItem>
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
                    <FormControl>
                      <UserSelect
                        multi
                        idEnterprise={idEnterprise}
                        values={field.value as string[]}
                        onChangeMulti={(val) => {
                          field.onChange(val);
                          markAsChanged();
                        }}
                        label={t('users')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </ItemContent>
      </Item>
    );
  };

  const permissionFields: { label: string; visibilityName: keyof FormFormData; usersName: keyof FormFormData }[] = [
    { label: t('visible.placeholder'), visibilityName: 'viewVisibility', usersName: 'viewUsers' },
    { label: t('config.form'), visibilityName: 'editVisibility', usersName: 'editUsers' },
    { label: t('fill.form', 'Preencher formulário'), visibilityName: 'fillVisibility', usersName: 'fillUsers' },
    { label: t('delete.form.board'), visibilityName: 'deleteFormBoardVisibility', usersName: 'deleteFormBoardUsers' },
    { label: t('edit.form.filling'), visibilityName: 'editFormFillingVisibility', usersName: 'editFormFillingUsers' },
  ];

  if (typeForm === 'RVE') {
    permissionFields.push({ label: t('justify'), visibilityName: 'justifyVisibility', usersName: 'justifyUsers' });
  }

  if (['RDO', 'Sondagem', 'NOON_REPORT'].includes(typeForm || '')) {
    permissionFields.push({ label: t('block'), visibilityName: 'blockVisibility', usersName: 'blockUsers' });
  }

  return (
    <DefaultFormLayout
      sections={[
        {
          title: t('permissions'),
          description: t('form.permissions.desc', 'Configure quem pode acessar e gerenciar este formulário'),
          fields: [
            <div className="space-y-6" key="permissions-grid">
              {permissionFields.map((fieldProps) => (
                <PermissionField key={fieldProps.visibilityName} {...fieldProps} />
              ))}
            </div>,
          ],
        },
      ]}
    />
  );
}
