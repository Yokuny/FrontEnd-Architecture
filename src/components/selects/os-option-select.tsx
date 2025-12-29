import { ClipboardCheck } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { OS_OPTIONS, type OsOption } from '@/lib/constants/select-options';

export function OsOptionSelect(props: OsOptionSelectProps) {
  const { t } = useTranslation();
  const { disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Simulated query object
  const query = {
    data: OS_OPTIONS,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: OsOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  const displayLabel = label || t('select.option');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ClipboardCheck className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<OsOption, OsOption>
        id={id}
        placeholder={placeholder || t('select.option')}
        value={props.value}
        onChange={(val) => props.onChange(val)}
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

interface OsOptionSelectProps {
  value?: string;
  onChange: (value: string | number | undefined) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}
