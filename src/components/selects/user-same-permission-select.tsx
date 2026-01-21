import { UserRound } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapUserSamePermissionToOptions, type UserSamePermission, useUserSamePermissionSelect } from '@/hooks/use-user-same-permission-api';

export function UserSamePermissionSelect(props: UserSamePermissionSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const query = useUserSamePermissionSelect();

  const mapWithDefaults = (users: UserSamePermission[]) => {
    const options = mapUserSamePermissionToOptions(users);
    return options.sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('user');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <UserRound className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<UserSamePermission, UserSamePermission>
          id={id}
          placeholder={placeholder || t('user')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapWithDefaults}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('not.found')}
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
          <UserRound className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<UserSamePermission, UserSamePermission>
        id={id}
        placeholder={placeholder || t('user')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapWithDefaults}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface UserSamePermissionSelectBaseProps {
  idUser?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserSamePermissionSelectSingleProps extends UserSamePermissionSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserSamePermissionSelectMultiProps extends UserSamePermissionSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserSamePermissionSelectProps = UserSamePermissionSelectSingleProps | UserSamePermissionSelectMultiProps;
