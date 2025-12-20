import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
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
  const query = useSensorsByMachineSelect(idMachine);

  const noOptionsMessage = !idMachine ? 'Selecione uma máquina primeiro.' : 'Nenhum sensor disponível.';

  if (multi) {
    return (
      <DataMultiSelect
        label={label}
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
    );
  }

  return (
    <DataSelect
      label={label}
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
  );
}
