import { Flag } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { PRIORITY_OPTIONS, type PriorityOption } from '@/lib/constants/select-options';

/**
 * PrioritySelect Component
 *
 * Provides selection for task/maintenance priority (Low, Medium, High).
 * Uses static data from central constants and supports single/multi modes.
 */
export function PrioritySelect(props: PrioritySelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = false } = props;
  const id = useId();

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
    const displayLabel = label || 'Prioridades';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Flag className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<PriorityOption, PriorityOption>
          id={id}
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
      </div>
    );
  }

  const displayLabel = label || 'Prioridade';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Flag className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<PriorityOption, PriorityOption>
        id={id}
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
    </div>
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
