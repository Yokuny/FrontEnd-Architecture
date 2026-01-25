import { Group } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { type SelectOption, UNIT_OPTIONS } from '@/lib/constants/select-options';
import { cn } from '@/lib/utils';

export function UnitSelect(props: UnitSelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: UNIT_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SelectOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  const displayLabel = label || t('unit.type');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Group className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SelectOption, SelectOption>
        id={id}
        placeholder={placeholder || t('unit.type')}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={cn('w-20', className)}
      />
    </div>
  );
}

interface UnitSelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
