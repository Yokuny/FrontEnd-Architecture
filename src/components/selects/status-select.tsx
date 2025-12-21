import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapStatusToOptions, useStatusSelect } from '@/hooks/use-status-api';

/**
 * StatusSelect Component
 *
 * This component fetches and displays a list of status options for a specific enterprise.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function StatusSelect(props: StatusSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useStatusSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum status disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<string, string>
        label={label || 'Status'}
        placeholder={placeholder || 'Selecione os status...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapStatusToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar status..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum status encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<string, string>
      label={label || 'Status'}
      placeholder={placeholder || 'Selecione um status...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapStatusToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar status..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum status encontrado."
      className={className}
    />
  );
}

interface StatusSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface StatusSelectSingleProps extends StatusSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface StatusSelectMultiProps extends StatusSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type StatusSelectProps = StatusSelectSingleProps | StatusSelectMultiProps;
