import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapTypeProblemsToOptions, type TypeProblem, useTypeProblemsSelect } from '@/hooks/use-type-problems-api';

/**
 * TypeProblemSelect Component
 *
 * This component fetches and displays a list of problem types for a specific enterprise.
 * It follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function TypeProblemSelect(props: TypeProblemSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;

  const query = useTypeProblemsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum tipo de problema disponível.';

  if (mode === 'multi') {
    return (
      <DataMultiSelect<TypeProblem, TypeProblem>
        label={label || 'Tipo de Problema'}
        placeholder={placeholder || 'Selecione os tipos...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as string[])}
        query={query}
        mapToOptions={mapTypeProblemsToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar tipo..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum tipo encontrado."
        className={className}
      />
    );
  }

  return (
    <DataSelect<TypeProblem, TypeProblem>
      label={label || 'Tipo de Problema'}
      placeholder={placeholder || 'Selecione um tipo...'}
      value={props.value}
      onChange={(val) => props.onChange(val as string)}
      query={query}
      mapToOptions={mapTypeProblemsToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar tipo..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum tipo encontrado."
      className={className}
    />
  );
}

interface TypeProblemSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface TypeProblemSelectSingleProps extends TypeProblemSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface TypeProblemSelectMultiProps extends TypeProblemSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type TypeProblemSelectProps = TypeProblemSelectSingleProps | TypeProblemSelectMultiProps;
