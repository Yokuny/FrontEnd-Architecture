import { Boxes } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapTypeServiceMaintenanceToOptions, useTypeServiceMaintenance } from '@/hooks/use-maintenance-plans-api';

// TODO: DEPRECATED ???????

export function TypeServiceMaintenanceSelect(props: TypeServiceMaintenanceSelectProps) {
  const { disabled = false, className, label, placeholder, clearable = true, value, onChange } = props;
  const id = useId();
  const { t } = useTranslation();

  const query = useTypeServiceMaintenance();

  const displayLabel = label || t('type.service');

  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Boxes className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<any, any>
        id={id}
        placeholder={placeholder || t('type.service')}
        value={value}
        onChange={onChange}
        query={query}
        mapToOptions={mapTypeServiceMaintenanceToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface TypeServiceMaintenanceSelectProps {
  value?: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}
