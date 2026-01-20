import { AlertCircle } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { LEVEL_OPTIONS } from '@/lib/constants/select-options';

export function LevelSelect(props: LevelSelectProps) {
  const { t } = useTranslation();
  const { mode, disabled = false, className, label, placeholder, clearable = true } = props;
  const id = useId();

  // Mapping options to translated ones
  const translatedOptions = LEVEL_OPTIONS.map((opt) => ({
    ...opt,
    name: t(opt.id),
  }));

  // Simulated query object
  const query = {
    data: translatedOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: any[]) => {
    return options.map((opt) => ({
      value: opt.id,
      label: opt.name,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('scale.level');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <AlertCircle className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect
          id={id}
          placeholder={placeholder || t('scale.level')}
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

  const displayLabel = label || t('scale.level');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect
        id={id}
        placeholder={placeholder || t('scale.level')}
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

interface LevelSelectBaseProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
}

interface LevelSelectSingleProps extends LevelSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface LevelSelectMultiProps extends LevelSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type LevelSelectProps = LevelSelectSingleProps | LevelSelectMultiProps;
