import { Factory } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { MACHINE_TYPES, type MachineTypeOption } from '@/lib/constants/select-options';

/**
 * TypeMachineSelect Component
 *
 * This component provides options for machine types (Ship, Truck, Industrial).
 * It follows the single/multi mode pattern and uses static data centralizing in constants.
 */
export function TypeMachineSelect(props: TypeMachineSelectProps) {
  const { mode, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: MACHINE_TYPES,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: MachineTypeOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Tipo de Máquina';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<MachineTypeOption, MachineTypeOption>
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

  const displayLabel = label || 'Tipo de Máquina';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Factory className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<MachineTypeOption, MachineTypeOption>
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

interface TypeMachineSelectBaseProps {
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface TypeMachineSelectSingleProps extends TypeMachineSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface TypeMachineSelectMultiProps extends TypeMachineSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type TypeMachineSelectProps = TypeMachineSelectSingleProps | TypeMachineSelectMultiProps;
