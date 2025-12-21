import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { PRIORITY_OPTIONS, type PriorityOption } from '@/lib/constants/select-options';

/**
 * PrioritySelect Component
 *
 * Provides selection for task/maintenance priority (Low, Medium, High).
 * Uses static data from central constants and supports single/multi modes.
 */
export function PrioritySelect(props: PrioritySelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = false } = props;

  // Simulated query object for static data
  const query = {
    data: PRIORITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: PriorityOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    return (
      <DataMultiSelect<PriorityOption, PriorityOption>
        label={label || 'Prioridades'}
        placeholder={placeholder || 'Selecione as prioridades...'}
        value={props.value}
        onChange={(vals) => props.onChange(vals as number[])}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        searchPlaceholder="Buscar prioridade..."
        noOptionsMessage="Nenhuma prioridade disponível."
        noResultsMessage="Nenhuma prioridade encontrada."
        className={className}
      />
    );
  }

  return (
    <DataSelect<PriorityOption, PriorityOption>
      label={label || 'Prioridade'}
      placeholder={placeholder || 'Selecione uma prioridade...'}
      value={props.value}
      onChange={(val) => props.onChange(val as number)}
      query={query as any}
      mapToOptions={mapToOptions}
      disabled={disabled}
      clearable={clearable}
      searchPlaceholder="Buscar prioridade..."
      noOptionsMessage="Nenhuma prioridade disponível."
      noResultsMessage="Nenhuma prioridade encontrada."
      className={className}
    />
  );
}

interface PrioritySelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface PrioritySelectSingleProps extends PrioritySelectBaseProps {
  mode: 'single';
  value?: number;
  onChange: (value: number | undefined) => void;
}

interface PrioritySelectMultiProps extends PrioritySelectBaseProps {
  mode: 'multi';
  value?: number[];
  onChange: (value: number[]) => void;
}

export type PrioritySelectProps = PrioritySelectSingleProps | PrioritySelectMultiProps;
