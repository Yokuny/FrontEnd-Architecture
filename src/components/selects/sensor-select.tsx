import { Radar } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import type { Sensor } from '@/hooks/use-sensors-api';
import { mapSensorsToOptions, useSensorsSelect } from '@/hooks/use-sensors-api';

export function SensorSelect({
  label,
  placeholder,
  value,
  values,
  onChange,
  onChangeMulti,
  idEnterprise,
  multi = false,
  disabled = false,
  clearable = true,
  className,
}: SensorSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = useSensorsSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');
  const sharedProps = {
    id,
    placeholder: placeholder || t('machine.sensors.placeholder'),
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
        <DataMultiSelect<Sensor, Sensor> {...sharedProps} value={values} onChange={(newValues) => onChangeMulti?.(newValues as string[])} />
      ) : (
        <DataSelect<Sensor, Sensor> {...sharedProps} value={value} onChange={(newValue) => onChange?.(newValue as string | undefined)} clearable={clearable} />
      )}
    </div>
  );
}

interface SensorSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idEnterprise?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}
