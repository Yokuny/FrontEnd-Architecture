import { Activity } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  // Use either machine ID or enterprise ID as the primary filter ID
  const filterId = idMachine || idEnterprise;
  const query = useSensorSignalsSelect(filterId, sensorId);

  const noOptionsMessage = !filterId ? t('identifier.not.provided') : !sensorId ? t('select.sensor.first') : t('noresults.message');

  if (mode === 'multi') {
    const displayLabel = label || t('signals');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Activity className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SensorSignal, SensorSignal>
          id={id}
          placeholder={placeholder || t('signals.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapSensorSignalsToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('signal');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Activity className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SensorSignal, SensorSignal>
        id={id}
        placeholder={placeholder || t('signal.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapSensorSignalsToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
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
