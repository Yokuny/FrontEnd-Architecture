import { Radar } from 'lucide-react';
import { useId } from 'react';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorsToOptions, useSensorsSelect } from '@/hooks/use-sensors-api';

interface SensorSelectProps {
  /** Label for the select field */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Currently selected sensor ID (single select) */
  value?: string;
  /** Currently selected sensor IDs (multi select) */
  values?: string[];
  /** Callback when selection changes (single select) */
  onChange?: (value: string | undefined) => void;
  /** Callback when selection changes (multi select) */
  onChangeMulti?: (values: string[]) => void;
  /** Whether to allow multiple selections */
  multi?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether single select can be cleared */
  clearable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function SensorSelect({
  label,
  placeholder = 'Selecione um sensor...',
  value,
  values,
  onChange,
  onChangeMulti,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: SensorSelectProps) {
  const id = useId();
  const query = useSensorsSelect();

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
          noOptionsMessage="Nenhum sensor disponível."
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
        noOptionsMessage="Nenhum sensor disponível."
        noResultsMessage="Nenhum sensor encontrado."
      />
    </div>
  );
}
