import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapParamsToOptions, type Param, useParamsSelect } from '@/hooks/use-params-api';

/**
 * ParamsSelect Component
 *
 * Fetches and displays global parameters.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function ParamsSelect(props: ParamsSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useParamsSelect();

  if (mode === 'multi') {
    return (
      <DataMultiSelect<Param, Param>
        label={label || 'Parâmetros (Múltiplo)'}
        placeholder={placeholder || 'Selecione os parâmetros...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapParamsToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar parâmetro..."
        noOptionsMessage="Nenhum parâmetro disponível."
        noResultsMessage="Nenhum parâmetro encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<Param, Param>
      label={label || 'Parâmetro (Único)'}
      placeholder={placeholder || 'Selecione um parâmetro...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapParamsToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar parâmetro..."
      noOptionsMessage="Nenhum parâmetro disponível."
      noResultsMessage="Nenhum parâmetro encontrado."
      className={className}
    />
  );
}

interface ParamsSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface ParamsSelectSingleProps extends ParamsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ParamsSelectMultiProps extends ParamsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ParamsSelectProps = ParamsSelectSingleProps | ParamsSelectMultiProps;
