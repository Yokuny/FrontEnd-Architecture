import { Settings } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPartsByMachineToOptions, usePartsByMachineSelect } from '@/hooks/use-specialized-api';

interface PartByMachineSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | number | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idMachine?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function PartByMachineSelect({
  label,
  placeholder = 'Selecione uma peça...',
  value,
  values,
  onChange,
  onChangeMulti,
  idMachine,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: PartByMachineSelectProps) {
  const id = useId();
  const query = usePartsByMachineSelect(idMachine);

  const noOptionsMessage = !idMachine ? 'Selecione uma máquina primeiro.' : 'Nenhuma peça disponível.';

  if (multi) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {label}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapPartsByMachineToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder="Buscar peça..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhuma peça encontrada."
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {label}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(val) => onChange?.(val)}
        query={query}
        mapToOptions={mapPartsByMachineToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder="Buscar peça..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhuma peça encontrada."
      />
    </div>
  );
}
