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

  const noOptionsMessage = !idEnterprise ? t('select.first.enterprise') : t('nooptions.message');

  if (multi) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Radar className="size-4" />
            {label}
          </Label>
        )}
        <DataMultiSelect<Sensor, Sensor>
          id={id}
          placeholder={placeholder || t('machine.sensors.placeholder')}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapSensorsToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('noresults.message')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Radar className="size-4" />
          {label}
        </Label>
      )}
      <DataSelect<Sensor, Sensor>
        id={id}
        placeholder={placeholder || t('machine.sensors.placeholder')}
        value={value}
        onChange={(newValue) => onChange?.(newValue as string | undefined)}
        query={query}
        mapToOptions={mapSensorsToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('noresults.message')}
      />
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
