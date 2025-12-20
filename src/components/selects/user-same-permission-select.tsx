import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapUserSamePermissionToOptions, type UserSamePermission, useUserSamePermissionSelect } from '@/hooks/use-user-same-permission-api';

/**
 * UserSamePermissionSelect Component
 *
 * Fetches and displays users with the same enterprise permissions.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function UserSamePermissionSelect(props: UserSamePermissionSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true, optionsDefault = [] } = props;

  const query = useUserSamePermissionSelect();

  const mapWithDefaults = (users: UserSamePermission[]) => {
    const options = mapUserSamePermissionToOptions(users);
    return [...options, ...optionsDefault].sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    return (
      <DataMultiSelect<UserSamePermission, UserSamePermission>
        label={label || 'Usuários (Múltiplo)'}
        placeholder={placeholder || 'Selecione os usuários...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapWithDefaults}
        disabled={disabled}
        searchPlaceholder="Buscar usuário..."
        noOptionsMessage="Nenhum usuário disponível."
        noResultsMessage="Nenhum usuário encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<UserSamePermission, UserSamePermission>
      label={label || 'Usuário (Único)'}
      placeholder={placeholder || 'Selecione um usuário...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapWithDefaults}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar usuário..."
      noOptionsMessage="Nenhum usuário disponível."
      noResultsMessage="Nenhum usuário encontrado."
      className={className}
    />
  );
}

interface UserSamePermissionSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  /** Static options to append to the list */
  optionsDefault?: { value: string | number; label: string; data: any }[];
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
