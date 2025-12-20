import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { mapAlertTypesToOptions, useAlertTypesSelect } from '@/hooks/use-alert-types-api';

interface AlertTypeSelectProps {
  label?: string;
  placeholder?: string;
  values?: string[];
  onChangeMulti: (values: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function AlertTypeSelect({ label, placeholder = 'Selecione os tipos de alerta...', values, onChangeMulti, disabled = false, className }: AlertTypeSelectProps) {
  const query = useAlertTypesSelect();

  return (
    <DataMultiSelect
      label={label}
      placeholder={placeholder}
      value={values}
      onChange={(newValues) => onChangeMulti(newValues as string[])}
      query={query}
      mapToOptions={mapAlertTypesToOptions}
      disabled={disabled}
      className={className}
      searchPlaceholder="Buscar tipo de alerta..."
      noOptionsMessage="Nenhum tipo de alerta disponível."
      noResultsMessage="Nenhum tipo encontrado."
    />
  );
}
