import { Radar } from 'lucide-react';
import { useId } from 'react';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorsByAssetsToOptions, type SensorByAsset, useSensorsByAssetsSelect } from '@/hooks/use-sensors-by-assets-api';

/**
 * SensorByAssetsSelect Component
 *
 * Fetches and displays sensors for a given list of asset IDs.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function SensorByAssetsSelect(props: SensorByAssetsSelectProps) {
  const { mode, idAssets, disabled = false, className, label, placeholder, clearable = true, idsNotAllowed = [] } = props;
  const id = useId();

  const query = useSensorsByAssetsSelect(idAssets);

  const noOptionsMessage = !idAssets || idAssets.length === 0 ? 'Selecione pelo menos um ativo primeiro.' : 'Nenhum sensor encontrado.';

  const filterOptions = (sensors: SensorByAsset[]) => {
    const options = mapSensorsByAssetsToOptions(sensors);
    if (idsNotAllowed.length === 0) return options;

    const lowerNotAllowed = idsNotAllowed.map((id) => id.toLowerCase());
    return options.filter((opt) => !lowerNotAllowed.includes(opt.value.toLowerCase()));
  };

  if (mode === 'multi') {
    const displayLabel = label || 'Sensores por Ativos';
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Radar className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SensorByAsset, SensorByAsset>
          id={id}
          placeholder={placeholder || 'Selecione os sensores...'}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={filterOptions}
          disabled={disabled}
          searchPlaceholder="Buscar sensor..."
          noOptionsMessage={noOptionsMessage}
          noResultsMessage="Nenhum sensor encontrado."
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || 'Sensor por Ativos';
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Radar className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SensorByAsset, SensorByAsset>
        id={id}
        placeholder={placeholder || 'Selecione um sensor...'}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={filterOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder="Buscar sensor..."
        noOptionsMessage={noOptionsMessage}
        noResultsMessage="Nenhum sensor encontrado."
        className={className}
      />
    </div>
  );
}

interface SensorByAssetsSelectBaseProps {
  idAssets?: string[];
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  /** IDs that should be filtered out from the options */
  idsNotAllowed?: string[];
}

interface SensorByAssetsSelectSingleProps extends SensorByAssetsSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SensorByAssetsSelectMultiProps extends SensorByAssetsSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type SensorByAssetsSelectProps = SensorByAssetsSelectSingleProps | SensorByAssetsSelectMultiProps;
