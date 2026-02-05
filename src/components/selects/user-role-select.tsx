import { UserPlus } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { useUsersNotInRole } from '@/hooks/use-users-not-in-role';
import type { UserListItem } from '@/routes/_private/permissions/users/@interface/user';

export function UserRoleSelect(props: UserRoleSelectProps) {
  const { t } = useTranslation();
  const { mode, idEnterprise, idRole, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useUsersNotInRole(idRole, idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : !idRole ? t('select.first.role') : t('nooptions.message');

  const mapToOptions = (users: UserListItem[]) => {
    return users
      .map((user) => ({
        value: user.id,
        label: user.name,
        data: user,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const displayLabel = label || (mode === 'multi' ? t('users') : t('user'));
  const sharedProps = {
    id,
    placeholder: placeholder || t('select.users.placeholder'),
    query: query as any,
    mapToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserPlus className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<UserListItem, UserListItem> {...sharedProps} value={props.value} onChange={(vals) => props.onChange(vals as string[])} />
      ) : (
        <DataSelect<UserListItem, UserListItem> {...sharedProps} value={props.value} onChange={(val) => props.onChange(val as string)} clearable={clearable} />
      )}
    </div>
  );
}

interface UserRoleSelectBaseProps {
  idEnterprise?: string;
  idRole?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserRoleSelectSingleProps extends UserRoleSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserRoleSelectMultiProps extends UserRoleSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserRoleSelectProps = UserRoleSelectSingleProps | UserRoleSelectMultiProps;
