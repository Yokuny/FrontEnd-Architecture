import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapUserTypesToOptions, type UserType, useUserTypesSelect } from '@/hooks/use-user-types-api';

/**
 * UserTypeSelect Component
 *
 * Fetches and displays user types. Can be filtered by enterprise ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function UserTypeSelect(props: UserTypeSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useUserTypesSelect(idEnterprise);

  if (mode === 'multi') {
    return (
      <DataMultiSelect<UserType, UserType>
        label={label || 'Tipos de Usuário (Múltiplo)'}
        placeholder={placeholder || 'Selecione os tipos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapUserTypesToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar tipo..."
        noOptionsMessage="Nenhum tipo disponível."
        noResultsMessage="Nenhum tipo encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<UserType, UserType>
      label={label || 'Tipo de Usuário (Único)'}
      placeholder={placeholder || 'Selecione um tipo...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapUserTypesToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar tipo..."
      noOptionsMessage="Nenhum tipo disponível."
      noResultsMessage="Nenhum tipo encontrado."
      className={className}
    />
  );
}

interface UserTypeSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserTypeSelectSingleProps extends UserTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserTypeSelectMultiProps extends UserTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserTypeSelectProps = UserTypeSelectSingleProps | UserTypeSelectMultiProps;
