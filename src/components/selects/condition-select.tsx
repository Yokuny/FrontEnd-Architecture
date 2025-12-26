import { Activity } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { CONDITION_OPTIONS, type ConditionOption } from '@/lib/constants/select-options';

/**
 * ConditionSelect Component
 *
 * Provides selection for logical conditions (Less than, Equal, Between, etc.).
 * Uses static data from central constants and supports single/multi modes.
 */
export function ConditionSelect(props: ConditionSelectProps) {
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Simulated query object for static data
  const query = {
    data: CONDITION_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: ConditionOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Condições';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Activity className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<ConditionOption, ConditionOption>
          id={id}
          placeholder={placeholder || 'Selecione as condições...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar condição..."
          noOptionsMessage="Nenhuma condição disponível."
          noResultsMessage="Nenhuma condição encontrada."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Condição';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Activity className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<ConditionOption, ConditionOption>
        id={id}
        placeholder={placeholder || 'Selecione uma condição...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar condição..."
        noOptionsMessage="Nenhuma condição disponível."
        noResultsMessage="Nenhuma condição encontrada."
        className={className}
      />
    </div>
  );
}

interface ConditionSelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface ConditionSelectSingleProps extends ConditionSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ConditionSelectMultiProps extends ConditionSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ConditionSelectProps = ConditionSelectSingleProps | ConditionSelectMultiProps;
