import { Microscope } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { VARIABLE_TYPES, type VariableTypeOption } from '@/lib/constants/select-options';

/**
 * TypeSensorSelect Component
 *
 * This component provides options for sensor variable types (INT, DECIMAL, etc.).
 * It follows the single/multi mode pattern and uses static data centralizing in constants.
 */
export function TypeSensorSelect(props: TypeSensorSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: VARIABLE_TYPES,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: VariableTypeOption[]) => {
    return options
      .map((opt) => ({
        value: opt.value,
        label: opt.label,
        data: opt,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Tipo de Variável';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Microscope className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<VariableTypeOption, VariableTypeOption>
          id={id}
          placeholder={placeholder || 'Selecione os tipos...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar tipo..."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Tipo de Variável';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Microscope className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<VariableTypeOption, VariableTypeOption>
        id={id}
        placeholder={placeholder || 'Selecione um tipo...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder="Buscar tipo..."
        className={className}
      />
    </div>
  );
}

interface TypeSensorSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface TypeSensorSelectSingleProps extends TypeSensorSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface TypeSensorSelectMultiProps extends TypeSensorSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type TypeSensorSelectProps = TypeSensorSelectSingleProps | TypeSensorSelectMultiProps;
