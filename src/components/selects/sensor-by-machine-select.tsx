import { Radar } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorsToOptions, useSensorsByMachineSelect } from '@/hooks/use-sensors-api';

export function SensorByMachineSelect({
  label,
  placeholder,
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
  const { t } = useTranslation();
  const id = useId();
  const query = useSensorsByMachineSelect(idMachine);

  const noOptionsMessage = !idMachine ? t('select.first.machine') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('sensor.placeholder'),
    query,
    mapToOptions: mapSensorsToOptions,
    disabled,
    className,
    searchPlaceholder: t('search.placeholder'),
    noOptionsMessage,
    noResultsMessage: t('not.found'),
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Radar className="size-4" />
          {label}
        </Label>
      )}
      {multi ? (
        <DataMultiSelect {...sharedProps} value={values} onChange={(newValues) => onChangeMulti?.(newValues as string[])} />
      ) : (
        <DataSelect {...sharedProps} value={value} onChange={(newValue) => onChange?.(newValue as string | undefined)} clearable={clearable} />
      )}
    </div>
  );
}

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
