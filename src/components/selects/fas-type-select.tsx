import { Tag } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { DataMultiSelect } from '@/components/ui/data-multi-select';
import { DataSelect } from '@/components/ui/data-select';
import { Label } from '@/components/ui/label';
import { FAS_REGULARIZATION_TYPES, FAS_TYPES, type FasTypeOption } from '@/lib/constants/select-options';

export function FasTypeSelect(props: FasTypeSelectProps) {
  const { t } = useTranslation();
  const { mode, noRegularization = false, disabled = false, className, label, placeholder } = props;
  const id = useId();

  // Combine options based on regularization preference
  const allOptions = [...FAS_TYPES];
  if (!noRegularization) {
    allOptions.push(...FAS_REGULARIZATION_TYPES);
  }

  // Simulated query object
  const query = {
    data: allOptions,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success' as const,
  };

  const mapToOptions = (options: FasTypeOption[]) => {
    return options.map((opt) => ({
      value: opt.id,
      label: opt.name,
      data: opt,
    }));
  };

  if (mode === 'multi') {
    const displayLabel = label || t('select.option');
    return (
      <div className="space-y-2">
        {displayLabel && (
          <Label htmlFor={id} className="flex items-center gap-2">
            <Tag className="size-4" />
            {displayLabel}
          </Label>
        )}
        <DataMultiSelect<FasTypeOption, FasTypeOption>
          id={id}
          placeholder={placeholder || t('select.option')}
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

  const displayLabel = label || t('select.option');
  return (
    <div className="space-y-2">
      {displayLabel && (
        <Label htmlFor={id} className="flex items-center gap-2">
          <Tag className="size-4" />
          {displayLabel}
        </Label>
      )}
      <DataSelect<FasTypeOption, FasTypeOption>
        id={id}
        placeholder={placeholder || t('select.option')}
        value={props.value}
        onChange={(val) => props.onChange(val as string)}
        query={query as any}
        mapToOptions={mapToOptions}
        disabled={disabled}
        clearable
        searchPlaceholder={t('search.placeholder')}
        noOptionsMessage={t('nooptions.message')}
        noResultsMessage={t('not.found')}
        className={className}
      />
    </div>
  );
}

interface FasTypeSelectBaseProps {
  noRegularization?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

interface FasTypeSelectSingleProps extends FasTypeSelectBaseProps {
  mode: 'single';
  value?: string;
  onChange: (value: string | undefined) => void;
}

interface FasTypeSelectMultiProps extends FasTypeSelectBaseProps {
  mode: 'multi';
  value?: string[];
  onChange: (value: string[]) => void;
}

export type FasTypeSelectProps = FasTypeSelectSingleProps | FasTypeSelectMultiProps;
