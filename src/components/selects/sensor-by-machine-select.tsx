import { Radar } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorsToOptions, useSensorsByMachineSelect } from '@/hooks/use-sensors-api';

interface SensorByMachineSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idMachine?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function SensorByMachineSelect({
  label,
  placeholder = 'Selecione um sensor...',
  value,
  values,
  onChange,
  onChangeMulti,
  idMachine,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: SensorByMachineSelectProps) {
  const id = useId();
  const query = useSensorsByMachineSelect(idMachine);

  const noOptionsMessage = !idMachine ? 'Selecione uma máquina primeiro.' : 'Nenhum sensor disponível.';

  if (multi) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            {label}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapSensorsToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder="Buscar sensor..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum sensor encontrado."
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Radar className="h-4 w-4" />
          {label}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(newValue) => onChange?.(newValue as string | undefined)}
        query={query}
        mapToOptions={mapSensorsToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder="Buscar sensor..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum sensor encontrado."
      />
    </div>
  );
}
