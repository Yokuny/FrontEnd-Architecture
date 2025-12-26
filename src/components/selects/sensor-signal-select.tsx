import { Activity } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorSignalsToOptions, type SensorSignal, useSensorSignalsSelect } from '@/hooks/use-sensor-signals-api';

/**
 * SensorSignalSelect Component
 *
 * Fetches and displays sensor signals based on a machine ID or enterprise ID, and a sensor ID.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function SensorSignalSelect(props: SensorSignalSelectProps) {
  const { mode, idMachine, idEnterprise, sensorId, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Use either machine ID or enterprise ID as the primary filter ID
  const filterId = idMachine || idEnterprise;
  const query = useSensorSignalsSelect(filterId, sensorId);

  const noOptionsMessage = !filterId ? 'Identificador não fornecido.' : !sensorId ? 'Selecione um sensor primeiro.' : 'Nenhum sinal encontrado.';

  if (mode === 'multi') {
    const displayLabel = label || 'Sinais';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SensorSignal, SensorSignal>
          id={id}
          placeholder={placeholder || 'Selecione os sinais...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapSensorSignalsToOptions}
          disabled={disabled}
          searchPlaceholder="Buscar sinal..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum sinal encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Sinal';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SensorSignal, SensorSignal>
        id={id}
        placeholder={placeholder || 'Selecione um sinal...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapSensorSignalsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar sinal..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum sinal encontrado."
        className={className}
      />
    </div>
  );
}

interface SensorSignalSelectBaseProps {
  idMachine?: string;
  idEnterprise?: string;
  sensorId?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface SensorSignalSelectSingleProps extends SensorSignalSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SensorSignalSelectMultiProps extends SensorSignalSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type SensorSignalSelectProps = SensorSignalSelectSingleProps | SensorSignalSelectMultiProps;
