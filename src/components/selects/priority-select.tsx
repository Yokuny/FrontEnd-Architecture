import { AlertTriangle } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { PRIORITY_OPTIONS, type PriorityOption } from '@/lib/constants/select-options';

export function PrioritySelect(props: PrioritySelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();

  const translatedOptions = PRIORITY_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`priority.${opt.label.toLowerCase()}`),
  }));

  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: PriorityOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  const displayLabel = label || t('support.priority.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <AlertTriangle className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<PriorityOption, PriorityOption>
        id={id}
        placeholder={placeholder || t('support.priority.placeholder')}
        value={value}
        onChange={(val) => onChange?.(val as number)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface PrioritySelectProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
