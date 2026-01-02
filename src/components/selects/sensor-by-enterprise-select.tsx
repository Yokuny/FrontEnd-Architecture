import { Radar } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapSensorsByEnterpriseToOptions, useSensorsByEnterpriseSelect } from '@/hooks/use-specialized-api';

export function SensorByEnterpriseSelect({
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
}: SensorByEnterpriseSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = useSensorsByEnterpriseSelect(idEnterprise);

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
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('machine.sensors.placeholder')}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapSensorsByEnterpriseToOptions}
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
      <DataSelect
        id={id}
        placeholder={placeholder || t('machine.sensors.placeholder')}
        value={value}
        onChange={(val) => onChange?.(val)}
        query={query}
        mapToOptions={mapSensorsByEnterpriseToOptions}
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

interface SensorByEnterpriseSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | number | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idEnterprise?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}
