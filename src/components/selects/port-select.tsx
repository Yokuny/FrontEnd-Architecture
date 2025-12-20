import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapPortsToOptions, type Port, usePortsSelect } from '@/hooks/use-ports-api';

/**
 * PortSelect Component
 *
 * This component fetches and displays a list of ports from the geofence API.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function PortSelect(props: PortSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = usePortsSelect();

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Port, Port>
        label={label || 'Porto (Múltiplo)'}
        placeholder={placeholder || 'Selecione os portos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapPortsToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar porto..."
        noOptionsMessage="Nenhum porto disponível."
        noResultsMessage="Nenhum porto encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Port, Port>
      label={label || 'Porto (Único)'}
      placeholder={placeholder || 'Selecione um porto...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapPortsToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar porto..."
      noOptionsMessage="Nenhum porto disponível."
      noResultsMessage="Nenhum porto encontrado."
      className={className}
    />
  );
}

interface PortSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface PortSelectSingleProps extends PortSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface PortSelectMultiProps extends PortSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type PortSelectProps = PortSelectSingleProps | PortSelectMultiProps;
