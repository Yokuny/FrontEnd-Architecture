import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import DefaultFormLayout from '@/components/default-form-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useRolePaths } from '@/hooks/use-roles-api';
import type { RoleFormData } from '../@interface/role';

interface PathsSelectorProps {
  form: UseFormReturn<RoleFormData>;
}

export function PathsSelector({ form }: PathsSelectorProps) {
  const { t } = useTranslation();
  const { data: paths, isLoading } = useRolePaths();

  const selectedPaths = form.watch('roles')?.map((r) => r.path) || [];

  const handleTogglePath = (path: string) => {
    const currentRoles = form.getValues('roles') || [];
    const isSelected = currentRoles.some((r) => r.path === path);

    if (isSelected) {
      form.setValue(
        'roles',
        currentRoles.filter((r) => r.path !== path),
      );
    } else {
      form.setValue('roles', [...currentRoles, { path }]);
    }
  };

  if (isLoading) {
    return (
      <Skeleton className="h-32 w-full flex items-center justify-center">
        <Spinner />
      </Skeleton>
    );
  }

  return (
    <DefaultFormLayout
      layout="vertical"
      sections={[
        {
          title: t('pages'),
          description: t('roles.pages.description', 'Selecione as páginas que este perfil pode acessar'),
          fields: [
            <div key="paths-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paths?.map((pathGroup) => (
                <div key={pathGroup.codeLanguage} className="space-y-3">
                  <h3 className="font-semibold text-sm">{t(pathGroup.codeLanguage)}</h3>
                  <div className="space-y-2">
                    {pathGroup.items.map((item) => {
                      const isChecked = selectedPaths.includes(item.path);
                      return (
                        <div key={item.path} className="flex items-center space-x-2">
                          <Checkbox id={`path-${item.path}`} checked={isChecked} onCheckedChange={() => handleTogglePath(item.path)} />
                          <Label htmlFor={`path-${item.path}`} className="text-sm font-normal cursor-pointer text-balance">
                            {t(item.codeLanguage)}
                            {item.isDeprecated && <span className="ml-1 text-xs text-muted-foreground">(DEPRECATED)</span>}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>,
          ],
        },
      ]}
    />
  );
}
