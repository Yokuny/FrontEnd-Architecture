import { Bell } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { Label } from '@/components/ui/label';
import { mapAlertTypesToOptions, useAlertTypesSelect } from '@/hooks/use-alert-types-api';

export function AlertTypeSelect({ label, placeholder, values, onChangeMulti, disabled = false, className }: AlertTypeSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = useAlertTypesSelect();

  return (
    <div className="space-y-2">
      {(label || t('scale.alert.type')) && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Bell className="size-4" />
          {label || t('scale.alert.type')}
        </Label>
      )}
      <DataMultiSelect
        id={id}
        placeholder={placeholder || t('scale.alert.type')}
        value={values}
        onChange={(newValues) => onChangeMulti(newValues as string[])}
        query={query}
        mapToOptions={mapAlertTypesToOptions}
        disabled={disabled}
        className={className}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
      />
    </div>
  );
}

interface AlertTypeSelectProps {
  label?: string;
  placeholder?: string;
  values?: string[];
  onChangeMulti: (values: string[]) => void;
  disabled?: boolean;
  className?: string;
}
