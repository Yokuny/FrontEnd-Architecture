import { Activity } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorSignalsToOptions, type SensorSignal, useSensorSignalsSelect } from '@/hooks/use-sensor-signals-api';

export function SensorSignalSelect(props: SensorSignalSelectProps) {
  const { mode, idMachine, idEnterprise, sensorId, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const { t } = useTranslation();

  // Use either machine ID or enterprise ID as the primary filter ID
  const filterId = idMachine || idEnterprise;
  const query = useSensorSignalsSelect(filterId, sensorId);

  const noOptionsMessage = !filterId ? t('select.sensor.first') : !sensorId ? t('select.sensor.first') : t('not.found');

  const displayLabel = label || (mode === 'multi' ? t('signals') : t('signal'));
  const sharedProps = {
    id,
    query,
    mapToOptions: mapSensorSignalsToOptions,
    disabled,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
    className,
  };

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Activity className="size-4" />
          {displayLabel}
        </Label>
      )}
      {mode === 'multi' ? (
        <DataMultiSelect<SensorSignal, SensorSignal>
          {...sharedProps}
          placeholder={placeholder || t('select.sensor.first')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
        />
      ) : (
        <DataSelect<SensorSignal, SensorSignal>
          {...sharedProps}
          placeholder={placeholder || t('signal.placeholder')}
          value={props.value}
          onChange={(val) => props.onChange(val as string)}
          clearable={clearable}
        />
      )}
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
