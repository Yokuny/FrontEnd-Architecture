import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapUserCodeIntegrationToOptions, type UserCodeIntegration, useUserCodeIntegrationSelect } from '@/hooks/use-user-code-integration-api';

/**
 * UserCodeIntegrationSelect Component
 *
 * Fetches and displays users with their integration codes.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function UserCodeIntegrationSelect(props: UserCodeIntegrationSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useUserCodeIntegrationSelect();

  if (mode === 'multi') {
    return (
      <DataMultiSelect<UserCodeIntegration, UserCodeIntegration>
        label={label || 'Integração de Usuários (Múltiplo)'}
        placeholder={placeholder || 'Selecione os usuários...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapUserCodeIntegrationToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar usuário..."
        noOptionsMessage="Nenhum usuário disponível."
        noResultsMessage="Nenhum usuário encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<UserCodeIntegration, UserCodeIntegration>
      label={label || 'Integração de Usuário (Único)'}
      placeholder={placeholder || 'Selecione um usuário...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapUserCodeIntegrationToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar usuário..."
      noOptionsMessage="Nenhum usuário disponível."
      noResultsMessage="Nenhum usuário encontrado."
      className={className}
    />
  );
}

interface UserCodeIntegrationSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface UserCodeIntegrationSelectSingleProps extends UserCodeIntegrationSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface UserCodeIntegrationSelectMultiProps extends UserCodeIntegrationSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type UserCodeIntegrationSelectProps = UserCodeIntegrationSelectSingleProps | UserCodeIntegrationSelectMultiProps;
