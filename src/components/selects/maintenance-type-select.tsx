import { Settings2 } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapMaintenanceTypesToOptions, useMaintenanceTypesSelect } from '@/hooks/use-maintenance-types-api';

export function MaintenanceTypeSelect(props: MaintenanceTypeSelectProps) {
  const { mode, idEnterprise, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();
  const { t } = useTranslation();

  const query = useMaintenanceTypesSelect(idEnterprise);

  const noOptionsMessage = !idEnterprise ? t('select.enterprise.first') : t('nooptions.message');

  if (mode === 'multi') {
    const displayLabel = label || t('maintenance.type');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings2 className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<string, string>
          id={id}
          placeholder={placeholder || t('maintenance.types.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query}
          mapToOptions={mapMaintenanceTypesToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('maintenance.type');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings2 className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<string, string>
        id={id}
        placeholder={placeholder || t('maintenance.type.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query}
        mapToOptions={mapMaintenanceTypesToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface MaintenanceTypeSelectBaseProps {
  idEnterprise?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

interface MaintenanceTypeSelectSingleProps extends MaintenanceTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface MaintenanceTypeSelectMultiProps extends MaintenanceTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type MaintenanceTypeSelectProps = MaintenanceTypeSelectSingleProps | MaintenanceTypeSelectMultiProps;
