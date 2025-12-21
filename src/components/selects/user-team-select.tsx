import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapUserTeamToOptions, type UserTeamMember, useUserTeamSelect } from '@/hooks/use-user-team-api';

/**
 * UserTeamSelect Component
 *
 * Fetches and displays users associated with a specific enterprise.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function UserTeamSelect(props: UserTeamSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = false } = props;

  const query = useUserTeamSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum usuário encontrado.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<UserTeamMember, UserTeamMember>
        label={label || 'Usuários da Equipe'}
        placeholder={placeholder || 'Selecione os usuários...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapUserTeamToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar usuário..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum usuário encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<UserTeamMember, UserTeamMember>
      label={label || 'Usuário da Equipe'}
      placeholder={placeholder || 'Selecione um usuário...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapUserTeamToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar usuário..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum usuário encontrado."
      className={className}
    />
  );
}

interface UserTeamSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserTeamSelectSingleProps extends UserTeamSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserTeamSelectMultiProps extends UserTeamSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserTeamSelectProps = UserTeamSelectSingleProps | UserTeamSelectMultiProps;
