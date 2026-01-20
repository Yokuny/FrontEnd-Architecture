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

  const noOptionsMessage = !idEnterprise ? t('select.first.enterprise') : !idRole ? t('select.first.role') : t('nooptions.message');

  const mapToOptions = (users: UserListItem[]) => {
    return users
      .map((user) => ({
        value: user.id,
        label: user.name,
        data: user,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('users');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <UserPlus className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<UserListItem, UserListItem>
          id={id}
          placeholder={placeholder || t('select.users.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('user');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <UserPlus className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<UserListItem, UserListItem>
        id={id}
        placeholder={placeholder || t('select.users.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
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
