import { Eye } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { VISIBILITY_OPTIONS, type VisibilityOption } from '@/lib/constants/select-options';

export function VisibilitySelect(props: VisibilitySelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder, value, onChange } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: VISIBILITY_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: VisibilityOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: t(opt.labelKey),
      data: opt,
    }));
  };

  const displayLabel = label || t('visibility');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Eye className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<VisibilityOption, VisibilityOption>
        id={id}
        placeholder={placeholder || t('visibility')}
        value={value}
        onChange={(val) => onChange?.(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={false}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface VisibilitySelectProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
