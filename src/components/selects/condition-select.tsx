import { Activity } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { CONDITION_OPTIONS } from '@/lib/constants/select-options';

/**
 * ConditionSelect Component
 *
 * Provides selection for logical conditions (Less than, Equal, Between, etc.).
 * Uses static data from central constants and supports single/multi modes.
 */
export function ConditionSelect(props: ConditionSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Mapping static options to translated ones
  const translatedOptions = CONDITION_OPTIONS.map((opt) => ({
    ...opt,
    label: t(`conditions.${opt.value.toLowerCase()}`),
  }));

  // Simulated query object for static data
  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: any[]) => {
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('condition.placeholder');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Activity className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('condition.placeholder')}
          value={props.value}
          onChange={(vals) => props.onChange(vals as string[])}
          query={query as any}
          mapToOptions={mapToOptions}
          disabled={disabled}
          searchPlaceholder={t('search.placeholder')}
          noOptionsMessage={t('nooptions.message')}
          noResultsMessage={t('not.found')}
          className={className}
        />
      </div>
    );
  }

  const displayLabel = label || t('condition.placeholder');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Activity className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder || t('condition.placeholder')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
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

interface ConditionSelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface ConditionSelectSingleProps extends ConditionSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface ConditionSelectMultiProps extends ConditionSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type ConditionSelectProps = ConditionSelectSingleProps | ConditionSelectMultiProps;
