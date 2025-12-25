import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapSensorsByEnterpriseToOptions, useSensorsByEnterpriseSelect } from '@/hooks/use-specialized-api';

interface SensorByEnterpriseSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | number | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idEnterprise?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function SensorByEnterpriseSelect({
  label,
  placeholder = 'Selecione um sensor...',
  value,
  values,
  onChange,
  onChangeMulti,
  idEnterprise,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: SensorByEnterpriseSelectProps) {
  const query = useSensorsByEnterpriseSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? 'Selecione uma empresa primeiro.' : 'Nenhum sensor disponível.';

  if (multi) {
    return (
      <DataMultiSelect
        label={label}
        placeholder={placeholder}
        value={values}
        onChange={(newValues) => onChangeMulti?.(newValues as string[])}
        query={query}
        mapToOptions={mapSensorsByEnterpriseToOptions}
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
      onChange={(val) => onChange?.(val)}
      query={query}
      mapToOptions={mapSensorsByEnterpriseToOptions}
      disabled={disabled}
      clearable={clearable}
      className={className}
      searchPlaceholder="Buscar sensor..."
      noOptionsMessage={noOptionsMessage}
      noResultsMessage="Nenhum sensor encontrado."
    />
  );
}
