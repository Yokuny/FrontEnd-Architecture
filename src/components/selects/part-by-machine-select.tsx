import { Settings } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { mapPartsByMachineToOptions, usePartsByMachineSelect } from '@/hooks/use-specialized-api';

export function PartByMachineSelect({
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
}: PartByMachineSelectProps) {
  const { t } = useTranslation();
  const id = useId();
  const query = usePartsByMachineSelect(idMachine);

  const noOptionsMessage = !idMachine ? t('select.enterprise.first') : t('nooptions.message');

  if (multi) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Settings className="size-4" />
            {label}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('part.placeholder')}
          value={values}
          onChange={(newValues) => onChangeMulti?.(newValues as string[])}
          query={query}
          mapToOptions={mapPartsByMachineToOptions}
          disabled={disabled}
          className={className}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={noOptionsMessage}
          noResultsMessage={t('not.found')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Settings className="size-4" />
          {label}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder || t('part.placeholder')}
        value={value}
        onChange={(val) => onChange?.(val)}
        query={query}
        mapToOptions={mapPartsByMachineToOptions}
        disabled={disabled}
        clearable={clearable}
        className={className}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={noOptionsMessage}
        noResultsMessage={t('not.found')}
      />
    </div>
  );
}

interface PartByMachineSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  values?: string[];
  onChange?: (value: string | number | undefined) => void;
  onChangeMulti?: (values: string[]) => void;
  idMachine?: string;
  multi?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}
