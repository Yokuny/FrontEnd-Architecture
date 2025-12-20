import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { mapSensorsByAssetsToOptions, type SensorByAsset, useSensorsByAssetsSelect } from '@/hooks/use-sensors-by-assets-api';

/**
 * SensorByAssetsSelect Component
 *
 * Fetches and displays sensors for a given list of asset IDs.
 * Follows the single/multi mode pattern and integrates with TanStack Query.
 */
export function SensorByAssetsSelect(props: SensorByAssetsSelectProps) {
  const { mode, idAssets, disabled = false, className, label, placeholder, clearable = true, idsNotAllowed = [] } = props;

  const query = useSensorsByAssetsSelect(idAssets);

  const noOptionsMessage = !idAssets || idAssets.length === 0 ? 'Selecione pelo menos um ativo primeiro.' : 'Nenhum sensor encontrado.';

  const filterOptions = (sensors: SensorByAsset[]) => {
    const options = mapSensorsByAssetsToOptions(sensors);
    if (idsNotAllowed.length === 0) return options;

    const lowerNotAllowed = idsNotAllowed.map((id) => id.toLowerCase());
    return options.filter((opt) => !lowerNotAllowed.includes(opt.value.toLowerCase()));
  };

  if (mode === 'multi') {
    return (
      <DataMultiSelect<SensorByAsset, SensorByAsset>
        label={label || 'Sensores por Ativos (Múltiplo)'}
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
    );
  }

  return (
    <DataSelect<SensorByAsset, SensorByAsset>
      label={label || 'Sensor por Ativos (Único)'}
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
