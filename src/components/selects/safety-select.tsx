import { ShieldCheck } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { SAFETY_AREAS, type SafetyAreaOption } from '@/lib/constants/select-options';

export function SafetySelect(props: SafetySelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Mapping options to translated ones
  const translatedOptions = SAFETY_AREAS.map((opt) => ({
    ...opt,
    label: t(`safety.${opt.value}`, { defaultValue: opt.label }),
  }));

  // Simulated query object
  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: SafetyAreaOption[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('safety');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<SafetyAreaOption, SafetyAreaOption>
          id={id}
          placeholder={placeholder || t('safety')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('noresults.message')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('safety');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <ShieldCheck className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<SafetyAreaOption, SafetyAreaOption>
        id={id}
        placeholder={placeholder || t('safety')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable={clearable}
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('noresults.message')}
        className={className}
      />
    </div>
  );
}

interface SafetySelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface SafetySelectSingleProps extends SafetySelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface SafetySelectMultiProps extends SafetySelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type SafetySelectProps = SafetySelectSingleProps | SafetySelectMultiProps;
